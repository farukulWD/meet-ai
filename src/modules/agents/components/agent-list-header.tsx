"use client";
import { Button } from "@/components/ui/button";
import { PlusIcon, XCircleIcon } from "lucide-react";
import React, { useState } from "react";
import NewAgentDialog from "./new-agents-dialog";
import { useAgentFilters } from "../hooks/use-agents-filters";
import { AgentSearchFilter } from "./agent-search-filter";
import { DEFAULT_PAGE } from "@/constance";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

function AgentListHeader() {
  const [filters, setFilters] = useAgentFilters();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const isAnyModifiedFilter = !!filters.search;

  const onClearFilters = () => {
    setFilters({
      search: "",
      page: DEFAULT_PAGE,
    });
  };
  return (
    <>
      <NewAgentDialog open={isDialogOpen} onOpenChange={setIsDialogOpen} />
      <div className="px-4 py-4 md:px-8 flex flex-col gap-y-4">
        <div className="flex justify-between items-center">
          <h5 className="font-medium text-xl">My Agents</h5>
          <Button onClick={() => setIsDialogOpen(true)}>
            <PlusIcon />
            New Agent
          </Button>
        </div>
        <ScrollArea>
          <div className="flex items-center p-1 gap-x-2">
            <AgentSearchFilter />
            {isAnyModifiedFilter && (
              <Button variant={"outline"} size={"sm"} onClick={onClearFilters}>
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

export default AgentListHeader;
