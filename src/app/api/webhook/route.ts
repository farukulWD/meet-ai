import OpenAi from "openai";
import { db } from "@/db";
import { agents, meetings } from "@/db/schema";
import { inngest } from "@/inngest/client";
import { streamVideo } from "@/lib/stream-video";
import { ChatCompletionMessageParam } from "openai/resources/index.mjs";
import {
  MessageNewEvent,
  CallEndedEvent,
  CallRecordingReadyEvent,
  CallSessionParticipantLeftEvent,
  CallSessionStartedEvent,
  CallTranscriptionReadyEvent,
  CallSessionParticipantJoinedEvent
} from "@stream-io/node-sdk";
import { and, eq, or, not } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { generateAvatarUri } from "@/lib/avatar";
import { streamChat } from "@/lib/stream-chat";

const openAiClient = new OpenAi({ apiKey: process.env.OPENAI_API_KEY! });

const verifySignatureWithSdk = (body: string, signature: string): boolean => {
  return streamVideo.verifyWebhook(body, signature);
};

export async function POST(req: NextRequest) {
  const signature = req.headers.get("x-signature");
  const apiKey = req.headers.get("x-api-key");

  if (!signature || !apiKey) {
    return NextResponse.json(
      { error: "Missing signature or Api key" },
      { status: 400 }
    );
  }

  const body = await req.text();

  if (!verifySignatureWithSdk(body, signature)) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  let payload: unknown;
  try {
    payload = JSON.parse(body) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const eventType = (payload as Record<string, unknown>)?.type;

  // -------------------------------
  // Session Started → mark active + load agent
  // -------------------------------
  if (eventType === "call.session_started") {
    const event = payload as CallSessionStartedEvent;
    const meetingId = event.call.custom?.meetingId;

    if (!meetingId) {
      return NextResponse.json({ error: "Missing meeting id" }, { status: 400 });
    }

    const [existingMeeting] = await db
      .select()
      .from(meetings)
      .where(
        and(
          eq(meetings.id, meetingId),
          not(eq(meetings.status, "completed")),
          not(eq(meetings.status, "active")),
          not(eq(meetings.status, "cancelled")),
          not(eq(meetings.status, "processing"))
        )
      );

    if (!existingMeeting) {
      return NextResponse.json(
        { error: "Meeting not found or invalid status" },
        { status: 400 }
      );
    }

    await db
      .update(meetings)
      .set({ status: "active", startedAt: new Date() })
      .where(eq(meetings.id, existingMeeting.id));

    const [existingAgent] = await db
      .select()
      .from(agents)
      .where(eq(agents.id, existingMeeting.agentId));

    if (!existingAgent) {
      return NextResponse.json({ error: "Agent not found" }, { status: 400 });
    }

    const call = streamVideo.video.call("default", meetingId);

    const realtimeClient = await streamVideo.video.connectOpenAi({
      call,
      openAiApiKey: process.env.OPENAI_API_KEY!,
      agentUserId: existingAgent.id,
    });

    await realtimeClient.updateSession({
      instructions: existingAgent.instructions,
    });
  }

  // -------------------------------
  // Participant Joined → greet if it's the AI agent
  // -------------------------------
  else if (eventType === "call.session_participant_joined") {
    const event = payload as CallSessionParticipantJoinedEvent;
    const meetingId = event.call_cid.split(":")[1];
    const participantId = event.participant.user.id;

    if (!meetingId || !participantId) {
      return NextResponse.json(
        { error: "Missing meetingId or participantId" },
        { status: 400 }
      );
    }

    const [existingMeeting] = await db
      .select()
      .from(meetings)
      .where(eq(meetings.id, meetingId));

    if (!existingMeeting) {
      return NextResponse.json({ error: "Meeting not found" }, { status: 404 });
    }

    const [existingAgent] = await db
      .select()
      .from(agents)
      .where(eq(agents.id, existingMeeting.agentId));

    if (!existingAgent) {
      return NextResponse.json({ error: "Agent not found" }, { status: 404 });
    }

    if (participantId === existingAgent.id) {
      // Agent just joined — greet
      const call = streamVideo.video.call("default", meetingId);
      const realtimeClient = await streamVideo.video.connectOpenAi({
        call,
        openAiApiKey: process.env.OPENAI_API_KEY!,
        agentUserId: existingAgent.id,
      });

      await realtimeClient.updateSession({
        instructions: existingAgent.instructions,
      });

      const greetingText = `Hello, I'm ${existingAgent.name}. I'll be assisting with this meeting.`;

      try {
        await realtimeClient.sendUserMessageContent([
          { type: "input_text", text: "greet now" },
        ]);
      } catch (err) {
        console.error("Failed to trigger AI greeting:", err);
      }

      const avatarUrl = generateAvatarUri({
        seed: existingAgent.name,
        variant: "botttsNeutral",
      });

      await streamChat.upsertUser({
        id: existingAgent.id,
        name: existingAgent.name,
        image: avatarUrl,
      });

      const channel = streamChat.channel("messaging", meetingId);
      await channel.watch();

      await channel.sendMessage({
        text: greetingText,
        user: {
          id: existingAgent.id,
          name: existingAgent.name,
          image: avatarUrl,
        },
      });
    }

    return NextResponse.json({ message: "Join handled" }, { status: 200 });
  }

  // -------------------------------
  // Participant Left → end call if agent leaves
  // -------------------------------
  else if (eventType === "call.session_participant_left") {
    const event = payload as CallSessionParticipantLeftEvent;
    const meetingId = event.call_cid.split(":")[1];
    const participantId = event.participant.user.id;

    if (!meetingId) {
      return NextResponse.json({ error: "Missing meeting id" }, { status: 400 });
    }

    const [existingMeeting] = await db
      .select()
      .from(meetings)
      .where(eq(meetings.id, meetingId));

    if (!existingMeeting) {
      return NextResponse.json({ error: "Meeting not found" }, { status: 404 });
    }

    if (participantId === existingMeeting.agentId) {
      const call = streamVideo.video.call("default", meetingId);
      await call.end();
    }

    return NextResponse.json({ message: "Leave handled" }, { status: 200 });
  }

  // -------------------------------
  // Session Ended → mark processing
  // -------------------------------
  else if (eventType === "call.session_ended") {
    const event = payload as CallEndedEvent;
    const meetingId = event.call.custom?.meetingId;

    if (!meetingId) {
      return NextResponse.json({ error: "Missing meeting id" }, { status: 400 });
    }

    await db
      .update(meetings)
      .set({
        status: "processing",
        endedAt: new Date(),
      })
      .where(and(eq(meetings.id, meetingId), eq(meetings.status, "active")));
  }

  // -------------------------------
  // Transcription Ready
  // -------------------------------
  else if (eventType === "call.transcription_ready") {
    const event = payload as CallTranscriptionReadyEvent;
    const meetingId = event.call_cid.split(":")[1];

    const [updateMeeting] = await db
      .update(meetings)
      .set({
        transcriptUrl: event.call_transcription.url,
      })
      .where(eq(meetings.id, meetingId))
      .returning();

    if (!updateMeeting) {
      return NextResponse.json({ error: "Meeting not found!" }, { status: 404 });
    }

    await inngest.send({
      name: "meetings/processing",
      data: {
        meetingId: updateMeeting.id,
        transcriptUrl: updateMeeting.transcriptUrl,
      },
    });
  }

  // -------------------------------
  // Recording Ready
  // -------------------------------
  else if (eventType === "call.recording_ready") {
    const event = payload as CallRecordingReadyEvent;
    const meetingId = event.call_cid.split(":")[1];

    await db
      .update(meetings)
      .set({
        recordingUrl: event.call_recording.url,
      })
      .where(eq(meetings.id, meetingId));
  }

  // -------------------------------
  // Chat Message → AI response
  // -------------------------------
  else if (eventType === "message.new") {
    const event = payload as MessageNewEvent;
    const userId = event.user?.id;
    const channelId = event.channel_id;
    const text = event.message?.text;

    if (!userId || !channelId || !text) {
      return NextResponse.json(
        { error: "Missing required field!" },
        { status: 404 }
      );
    }

    const [existingMeeting] = await db
      .select()
      .from(meetings)
      .where(
        and(
          eq(meetings.id, channelId),
          or(eq(meetings.status, "completed"), eq(meetings.status, "active"))
        )
      );

    if (!existingMeeting) {
      return NextResponse.json({ error: "Meeting not found!" }, { status: 404 });
    }

    const [existingAgent] = await db
      .select()
      .from(agents)
      .where(eq(agents.id, existingMeeting.agentId));

    if (!existingAgent) {
      return NextResponse.json({ error: "Agent not found!" }, { status: 404 });
    }

    if (userId !== existingAgent.id) {
      const instructions = `
      You are an AI assistant helping the user revisit or continue a meeting.
      Meeting summary:
      ${existingMeeting.summery}

      Your original behavioral instructions:
      ${existingAgent.instructions}

      Use the meeting summary and conversation history to provide clear, concise, and accurate answers.
      If the summary lacks info, politely let the user know.
      `;

      const channel = streamChat.channel("messaging", channelId);
      await channel.watch();

      const previousMessages = channel.state.messages
        .slice(-5)
        .filter((msg) => msg.text && msg.text.trim() !== "")
        .map<ChatCompletionMessageParam>((message) => ({
          role: message.user?.id === existingAgent.id ? "assistant" : "user",
          content: message.text || "",
        }));

      const GPTResponse = await openAiClient.chat.completions.create({
        messages: [
          { role: "system", content: instructions },
          ...previousMessages,
          { role: "user", content: text },
        ],
        model: "gpt-4o",
      });

      const GPTResponseText = GPTResponse.choices[0].message.content;

      if (!GPTResponseText) {
        return NextResponse.json({ error: "No response from gpt" }, { status: 400 });
      }

      const avatarUrl = generateAvatarUri({
        seed: existingAgent.name,
        variant: "botttsNeutral",
      });

      await streamChat.upsertUser({
        id: existingAgent.id,
        name: existingAgent.name,
        image: avatarUrl,
      });

      await channel.sendMessage({
        text: GPTResponseText,
        user: {
          id: existingAgent.id,
          name: existingAgent.name,
          image: avatarUrl,
        },
      });
    }
  }

  return NextResponse.json({ message: "Event handled" }, { status: 200 });
}
