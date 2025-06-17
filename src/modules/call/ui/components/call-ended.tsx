"use client";
import { Button } from "@/components/ui/button";
import Link from "next/link";

function CallEnded() {
  return (
    <div className="flex flex-col h-full justify-center items-center bg-radial from-sidebar-accent to-sidebar">
      <div className="py-4 px-8 flex flex-1 justify-center items-center">
        <div className="flex flex-col gap-y-6 justify-center items-center bg-background p-10 shadow-sm rounded-lg">
          <div className="flex flex-col text-center gap-y-2">
            <h6 className="text-lg font-medium ">You have ended the call</h6>
            <p className="text-sm">Summery will appear in a few minutes</p>
          </div>
          <Button asChild>
            <Link href={"/meetings"}>Back to Meetings</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

export default CallEnded;
