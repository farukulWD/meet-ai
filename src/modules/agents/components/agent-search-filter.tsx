"use client";
import { Input } from "@/components/ui/input";
import React from "react";
import { useAgentFilters } from "../hooks/use-agents-filters";
import { SearchIcon } from "lucide-react";

export const AgentSearchFilter = () => {
  const [filters, setFilters] = useAgentFilters();
  return (
    <div className="relative">
      <Input
        className="h-9 bg-white max-w-[200px] pl-7"
        value={filters.search}
        onChange={(e) => setFilters({ search: e.target.value })}
        placeholder="Filter by name"
      />
      <SearchIcon className="size-4 absolute left-2 -translate-y-1/2 top-1/2 text-muted-foreground" />
    </div>
  );
};
