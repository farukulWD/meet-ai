"use client";
import ErrorState from "@/components/error-state";
import LoadingState from "@/components/loading-state";
import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import React from "react";

import { columns } from "../../components/columns";
import EmptyState from "@/components/empty-state";
import { useAgentFilters } from "../../hooks/use-agents-filters";
import DataPagination from "../../components/data-paginaton";
import { useRouter } from "next/navigation";
import { DataTable } from "@/components/data-table";

function AgentsView() {
  const router = useRouter();
  const trpc = useTRPC();
  const [filters, setFilters] = useAgentFilters();
  const { data } = useSuspenseQuery(
    trpc.agents.getMany.queryOptions({ ...filters })
  );

  return (
    <div className="flex-1 pb-4 px-4 md:px-8 flex flex-col gap-y-4">
      <DataTable
        data={data?.items}
        columns={columns}
        onRowClick={(row) => router.push(`/agents/${row.id}`)}
      />
      <DataPagination
        page={filters.page}
        totalPages={data.totalPages}
        onPageChanges={(page) => setFilters({ page })}
      />
      {data?.items?.length === 0 && (
        <EmptyState
          title="Create your first agent"
          description="Create an agent to join your meetings. Each agents follow your instructions and can interact with your participants during the call  "
        />
      )}
    </div>
  );
}

export default AgentsView;

export const AgentsViewLoading = () => {
  return (
    <LoadingState
      title="Loading Agents"
      description="This may take a few second"
    />
  );
};

export const AgentsViewError = () => {
  return (
    <ErrorState title="Agents Loading failed" description="Try again later" />
  );
};
