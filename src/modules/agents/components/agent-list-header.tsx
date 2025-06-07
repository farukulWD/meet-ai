"use client";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import React, { useState } from "react";
import NewAgentDialog from "./new-agents-dialog";

function AgentListHeader() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
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
      </div>
    </>
  );
}

export default AgentListHeader;
