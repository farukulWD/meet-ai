import CommandSelect from "@/components/command-select";
import { useMeetingFilters } from "../hooks/use-meetings-filters";
import { useTRPC } from "@/trpc/client";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { GeneratedAvatar } from "@/components/generated-avatar";

export const AgentIdFilter = () => {
  const [filters, setFilters] = useMeetingFilters();
  const trpc = useTRPC();
  const [agentSearch, setAgentSearch] = useState("");

  const { data } = useQuery(
    trpc.agents.getMany.queryOptions({
      pageSize: 100,
      search: agentSearch,
    })
  );

  return (
    <CommandSelect
      className="h-9"
      placeholder="Agent"
      options={(data?.items || []).map((agent) => ({
        id: agent.id,
        value: agent.id,
        children: (
          <div className="flex items-center gap-x-2 capitalize">
            <GeneratedAvatar
              className="size-4"
              variant="botttsNeutral"
              seed={agent.name}
            />
            {agent.name}
          </div>
        ),
      }))}
      value={filters.agentId ?? ""}
      onSelect={(value) => setFilters({ agentId: value })}
      onSearch={setAgentSearch}
    />
  );
};
