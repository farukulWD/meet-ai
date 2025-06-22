"use client";
import ErrorState from "@/components/error-state";
import LoadingState from "@/components/loading-state";
import { useTRPC } from "@/trpc/client";
import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import React, { useState } from "react";
import MeetingIdViewHeader from "../../components/meeting-id-view-header";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useConfirm } from "@/hooks/use-confirmation";
import UpdateMeetingDialog from "../../components/update-meetings-dialog";
import UpcomingState from "../../components/upcoming-state";
import ActiveState from "../../components/active-state";
import CancelledState from "../../components/cancelled-state";
import ProcessingState from "../../components/processing-state";
import CompletedState from "../../components/completed-state";
interface Props {
  meetingId: string;
}

function MeetingIdView({ meetingId }: Props) {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const router = useRouter();
  const [openUpdateDialog, setOpenUpdateDialog] = useState(false);

  const { data } = useSuspenseQuery(
    trpc.meetings.getONe.queryOptions({ id: meetingId })
  );

  const removeMeeting = useMutation(
    trpc.meetings.remove.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(
          trpc.meetings.getMany.queryOptions({})
        );
        await queryClient.invalidateQueries(
          trpc.premium.getFreeUsage.queryOptions()
        );
        router.push("/meetings");
      },
      onError: (error) => {
        toast.error(error.message);
      },
    })
  );

  const [RemoveConfirmation, confirmRemove] = useConfirm(
    "Are you sure?",
    `The Following action will remove this meeting`
  );

  const handleRemoveAgent = async () => {
    const ok = await confirmRemove();

    if (!ok) {
      return;
    }

    await removeMeeting.mutate({ id: meetingId });
  };

  const isActive = data.status === "active";
  const isUpcoming = data.status === "upcoming";
  const isProcessing = data.status === "processing";
  const isCancelled = data.status === "cancelled";
  const isCompleted = data.status === "completed";

  return (
    <>
      <RemoveConfirmation />
      <UpdateMeetingDialog
        initialValues={data}
        open={openUpdateDialog}
        onOpenChange={setOpenUpdateDialog}
      />

      <div className="flex-1 px-4 py-4 md:px-8 flex flex-col gap-y-4">
        <MeetingIdViewHeader
          meetingId={data?.id}
          meetingName={data?.name}
          onEdit={() => setOpenUpdateDialog(true)}
          onRemove={() => handleRemoveAgent()}
        />
        {isCancelled && <CancelledState />}
        {isProcessing && <ProcessingState />}
        {isActive && <ActiveState meetingId={meetingId} />}
        {isCompleted && <CompletedState data={data} />}
        {isUpcoming && <UpcomingState meetingId={meetingId} />}
      </div>
    </>
  );
}

export default MeetingIdView;
export const MeetingIdViewLoading = () => {
  return (
    <LoadingState
      title="Loading Meeting"
      description="This may take a few second"
    />
  );
};

export const MeetingIdViewError = () => {
  return (
    <ErrorState title="Meeting Loading failed" description="Try again later" />
  );
};
