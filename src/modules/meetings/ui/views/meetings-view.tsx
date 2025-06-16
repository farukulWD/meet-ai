"use client";

import { DataTable } from "@/components/data-table";
import ErrorState from "@/components/error-state";
import LoadingState from "@/components/loading-state";
import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import { columns } from "../../components/columns";
import EmptyState from "@/components/empty-state";
import { useMeetingFilters } from "../../hooks/use-meetings-filters";
import DataPagination from "@/components/data-paginaton";
import { useRouter } from "next/navigation";

function MeetingView() {
  const router = useRouter();
  const trpc = useTRPC();
  const [filters, setFilters] = useMeetingFilters();
  const { data } = useSuspenseQuery(
    trpc.meetings.getMany.queryOptions({ ...filters })
  );
  return (
    <div className="flex-1 pb-4 px-4 md:px-8 flex flex-col gap-y-4">
      <DataTable
        data={data.items}
        columns={columns}
        onRowClick={(row) => router.push(`/meetings/${row.id}`)}
      />
      <DataPagination
        page={filters.page}
        totalPages={data.totalPages}
        onPageChanges={(page) => setFilters({ page })}
      />
      {data?.items?.length === 0 && (
        <EmptyState
          title="Create your first meeting"
          description="Schedule a meeting to connect others. Each meeting lets collaborate, share ideas and interact with participate in real time"
        />
      )}
    </div>
  );
}

export default MeetingView;
export const MeetingsViewLoading = () => {
  return (
    <LoadingState
      title="Loading Meetings"
      description="This may take a few second"
    />
  );
};

export const MeetingsViewError = () => {
  return (
    <ErrorState title="Meetings Loading failed" description="Try again later" />
  );
};
