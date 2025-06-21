import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  MAX_FREE_AGENTS,
  MAX_FREE_MEETINGS,
} from "@/modules/premium/server/constance";
import { useTRPC } from "@/trpc/client";
import { useQuery } from "@tanstack/react-query";
import { RocketIcon } from "lucide-react";
import Link from "next/link";
import React from "react";

function DashboardTrial() {
  const trpc = useTRPC();
  const { data } = useQuery(trpc.premium.getFreeUsage.queryOptions());
  if (!data) {
    return null;
  }
  return (
    <div className="border border-border/10 rounded-lg w-full flex flex-col bg-white/10 gap-y-2">
      <div className="p-3 flex flex-col gap-y-4">
        <div className="flex gap-2 items-center">
          <RocketIcon className="size-4" />
          <p className="text-sm font-medium "> Free Trial</p>
        </div>
        <div className="flex flex-col gap-y-2">
          <p className="text-xs">
            {data.agentCount}/{MAX_FREE_AGENTS} Agents
          </p>
          <Progress value={(data.agentCount / MAX_FREE_AGENTS) * 100} />
        </div>
        <div className="flex flex-col gap-y-2">
          <p className="text-xs">
            {data.meetingCount}/{MAX_FREE_MEETINGS} Meetings
          </p>
          <Progress value={(data.meetingCount / MAX_FREE_MEETINGS) * 100} />
        </div>
      </div>
      <Button
        asChild
        className="bg-transparent border-t border-border/10 rounded-t-none hover:bg-white/10"
      >
        <Link href={"/upgrade"}>Upgrade</Link>
      </Button>
    </div>
  );
}

export default DashboardTrial;
