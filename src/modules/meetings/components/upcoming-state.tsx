import EmptyState from "@/components/empty-state";
import { Button } from "@/components/ui/button";
import { BanIcon, VideoIcon } from "lucide-react";
import Link from "next/link";
import React from "react";
interface Props {
  meetingId: string;
  onCancelMeeting: () => void;
  isCanceling: boolean;
}

function UpcomingState({ meetingId, onCancelMeeting, isCanceling }: Props) {
  return (
    <div className=" bg-white rounded-lg px-4 py-5 flex flex-col gap-y-8 items-center ">
      <EmptyState
        title="Not Start yet"
        description="Once you start this meeting, a summery will appear here!"
        image="/upcoming.svg"
      />
      <div className="flex flex-col-reverse lg:flex-row lg:justify-center items-center gap-2 w-full">
        <Button
          onClick={onCancelMeeting}
          disabled={isCanceling}
          variant={"secondary"}
          className="w-full lg:w-auto"
        >
          <BanIcon />
          Cancel Meeting
        </Button>
        <Button disabled={isCanceling} asChild className="w-full lg:w-auto">
          <Link href={`/call/${meetingId}`}>
            <VideoIcon />
            Start Meeting
          </Link>
        </Button>
      </div>
    </div>
  );
}

export default UpcomingState;
