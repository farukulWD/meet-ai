"use client";
import { Button } from "@/components/ui/button";
import { PlusIcon, XCircleIcon } from "lucide-react";
import React, { useState } from "react";
import { DEFAULT_PAGE } from "@/constance";
import NewMeetingDialog from "./new-meetings-dialog";

function MeetingListHeader() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <>
      <NewMeetingDialog open={isDialogOpen} onOpenChange={setIsDialogOpen} />
      <div className="px-4 py-4 md:px-8 flex flex-col gap-y-4">
        <div className="flex justify-between items-center">
          <h5 className="font-medium text-xl">My Meetings</h5>
          <Button onClick={() => setIsDialogOpen(true)}>
            <PlusIcon />
            New Meeting
          </Button>
        </div>
        <div className="flex items-center p-1 gap-x-2">
          <Button variant={"outline"} size={"sm"} onClick={() => {}}>
            <XCircleIcon /> Clear
          </Button>
        </div>
      </div>
    </>
  );
}

export default MeetingListHeader;
