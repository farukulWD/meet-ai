"use client";
import { Button } from "@/components/ui/button";
import { PlusIcon, XCircleIcon } from "lucide-react";
import React, { useState } from "react";
import { DEFAULT_PAGE } from "@/constance";
import NewMeetingDialog from "./new-meetings-dialog";
import { MeetingSearchFilter } from "./meeting-search-filter";
import { useMeetingFilters } from "../hooks/use-meetings-filters";
import { StatusFilter } from "./status-filter";
import { AgentIdFilter } from "./agent-id-filter";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

function MeetingListHeader() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [filters, setFilters] = useMeetingFilters();
  const isAnyFilterModify =
    !!filters.agentId || !!filters.search || !!filters.status;

  const onClearFilter = () => {
    setFilters({
      page: DEFAULT_PAGE,
      agentId: "",
      status: null,
      search: "",
    });
  };

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

        <ScrollArea>
          <div className="flex items-center p-1 gap-x-2">
            <MeetingSearchFilter />
            <StatusFilter />
            <AgentIdFilter />

            {isAnyFilterModify && (
              <Button
                variant={"outline"}
                size={"sm"}
                onClick={() => onClearFilter()}
              >
                <XCircleIcon /> Clear
              </Button>
            )}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>
    </>
  );
}

export default MeetingListHeader;
