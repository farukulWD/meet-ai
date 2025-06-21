"use client";
import Markdown from "react-markdown";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MeetingGetOne } from "../types";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import {
  BookOpenTextIcon,
  SparklesIcon,
  FileTextIcon,
  FileVideoIcon,
  ClockFadingIcon,
} from "lucide-react";
import { GeneratedAvatar } from "@/components/generated-avatar";
import Link from "next/link";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { formateDuration } from "@/lib/utils";
import Transcript from "./transcript";
import ChatProvider from "./chat-provider";

interface Props {
  data: MeetingGetOne;
}

function CompletedState({ data }: Props) {
  return (
    <div className="flex flex-col gap-y-4">
      <Tabs defaultValue="summary">
        <div className="bg-white border rounded-lg px-3">
          <ScrollArea>
            <TabsList className="bg-background p-0 rounded-none h-13 justify-start">
              <TabsTrigger
                value="summary"
                className="text-muted-foreground rounded-none bg-background data-[state=active]:shadow-none border-b-2 border-transparent data-[state=active]:border-b-primary data-[state=active]:text-accent-foreground h-full hover:text-accent-foreground"
              >
                <BookOpenTextIcon />
                Summary
              </TabsTrigger>
              <TabsTrigger
                value="transcript"
                className="text-muted-foreground rounded-none bg-background data-[state=active]:shadow-none border-b-2 border-transparent data-[state=active]:border-b-primary data-[state=active]:text-accent-foreground h-full hover:text-accent-foreground"
              >
                <FileTextIcon />
                Transcript
              </TabsTrigger>
              <TabsTrigger
                value="recording"
                className="text-muted-foreground rounded-none bg-background data-[state=active]:shadow-none border-b-2 border-transparent data-[state=active]:border-b-primary data-[state=active]:text-accent-foreground h-full hover:text-accent-foreground"
              >
                <FileVideoIcon />
                Recording
              </TabsTrigger>
              <TabsTrigger
                value="chat"
                className="text-muted-foreground rounded-none bg-background data-[state=active]:shadow-none border-b-2 border-transparent data-[state=active]:border-b-primary data-[state=active]:text-accent-foreground h-full hover:text-accent-foreground"
              >
                <SparklesIcon />
                Ask AI
              </TabsTrigger>
            </TabsList>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </div>
        <TabsContent value="chat">
          <ChatProvider meetingId={data?.id} meetingName={data?.name} />
        </TabsContent>
        <TabsContent value="transcript">
          <Transcript meetingId={data?.id} />
        </TabsContent>
        <TabsContent value="recording">
          <div className="bg-white rounded-lg border py-5 px-4">
            <video
              src={data?.recordingUrl!}
              className="w-full rounded-lg"
              controls
            />
          </div>
        </TabsContent>
        <TabsContent value="summary">
          <div className="bg-white rounded-lg border">
            <div className="py-5 px-4 gap-y-5 flex flex-col col-span-5">
              <h2 className="text-2xl font-medium capitalize">{data.name}</h2>
              <div className="flex gap-x-2 items-center">
                <Link
                  href={`/agents/${data.agentId}`}
                  className="flex items-center gap-x-2 underline underline-offset-4 capitalize"
                >
                  <GeneratedAvatar
                    seed={data?.agent.name}
                    variant="botttsNeutral"
                    className="size-5"
                  />
                  {data?.agent?.name}
                </Link>{" "}
                {data.startedAt ? format(data.startedAt, "PPP") : ""}
              </div>
              <div className="flex gap-x-2 items-center">
                <SparklesIcon size={"4"} />
                <p>Generale Summary</p>
              </div>
              <Badge
                variant={"outline"}
                className="flex items-center gap-x-2 [&>svg]:size-4"
              >
                <ClockFadingIcon className="text-blue-700" />
                {data.duration ? formateDuration(data.duration) : "No Duration"}
              </Badge>
              <div>
                <Markdown
                  components={{
                    h1: (props) => (
                      <h1 className="font-medium text-2xl mb-6" {...props} />
                    ),
                    h2: (props) => (
                      <h2 className="font-medium text-xl mb-6" {...props} />
                    ),
                    h3: (props) => (
                      <h3 className="font-medium text-lg mb-6" {...props} />
                    ),
                    h4: (props) => (
                      <h4 className="font-medium text-base mb-6" {...props} />
                    ),
                    p: (props) => (
                      <h4 className="leading-relaxed mb-6" {...props} />
                    ),
                    ul: (props) => (
                      <ul className="list-disc list-inside mb-6" {...props} />
                    ),
                    ol: (props) => (
                      <ol
                        className="list-decimal list-inside mb-6"
                        {...props}
                      />
                    ),
                    li: (props) => <li className="mb-1" {...props} />,
                    strong: (props) => (
                      <strong className="font-semibold " {...props} />
                    ),
                    code: (props) => (
                      <code
                        className="bg-gray-100 px-1 py-0.5 rounded"
                        {...props}
                      />
                    ),
                    blockquote: (props) => (
                      <blockquote
                        className="border-l-4 pl-4 italic my-4"
                        {...props}
                      />
                    ),
                  }}
                >
                  {data?.summery}
                </Markdown>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default CompletedState;
