import { db } from "@/db";
import { agents, meetings } from "@/db/schema";
import { streamVideo } from "@/lib/stream-video";
import {
  CallSessionParticipantLeftEvent,
  CallSessionStartedEvent,
} from "@stream-io/node-sdk";
import { and, eq, not } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

const verifySignatureWithSdk = (body: string, signature: string): boolean => {
  return streamVideo.verifyWebhook(body, signature);
};

export async function POST(req: NextRequest) {
  try {
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

    if (eventType === "call.session_started") {
      return await handleCallSessionStarted(payload as CallSessionStartedEvent);
    }

    if (eventType === "call.session_participate_left") {
      return await handleCallSessionParticipantLeft(
        payload as CallSessionParticipantLeftEvent
      );
    }

    return NextResponse.json({ message: "Event ignored" }, { status: 200 });
  } catch (err) {
    console.error("Webhook processing failed:", err);
    return NextResponse.json(
      {
        error: {
          type: "server_error",
          code: "42",
          message: err instanceof Error ? err.message : String(err),
          param: null,
          event_id: "",
        },
      },
      { status: 500 }
    );
  }
}

async function handleCallSessionStarted(event: CallSessionStartedEvent) {
  try {
    const meetingId = event.call.custom?.meetingId;

    if (!meetingId) {
      return NextResponse.json(
        { error: "Missing meeting id" },
        { status: 400 }
      );
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

    return NextResponse.json(
      { message: "Call session started handled" },
      { status: 200 }
    );
  } catch (err) {
    console.error("Error in handleCallSessionStarted:", err);
    return NextResponse.json(
      {
        error: {
          type: "server_error",
          code: "42",
          message: err instanceof Error ? err.message : String(err),
          param: null,
          event_id: "",
        },
      },
      { status: 500 }
    );
  }
}

async function handleCallSessionParticipantLeft(
  event: CallSessionParticipantLeftEvent
) {
  try {
    const meetingId = event.call_cid.split(":")[1];

    if (!meetingId) {
      return NextResponse.json(
        { error: "Missing meeting id" },
        { status: 400 }
      );
    }

    const call = streamVideo.video.call("default", meetingId);
    await call.end();

    return NextResponse.json({ message: "Call ended" }, { status: 200 });
  } catch (err) {
    console.error("Error in handleCallSessionParticipantLeft:", err);
    return NextResponse.json(
      {
        error: {
          type: "server_error",
          code: "42",
          message: err instanceof Error ? err.message : String(err),
          param: null,
          event_id: "",
        },
      },
      { status: 500 }
    );
  }
}
