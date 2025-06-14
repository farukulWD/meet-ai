"use client";

import ErrorState from "@/components/error-state";
import LoadingState from "@/components/loading-state";
import { useTRPC } from "@/trpc/client";
import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import AgentIdViewHeader from "../../components/agent-id-view-header";
import { GeneratedAvatar } from "@/components/generated-avatar";
import { Badge } from "@/components/ui/badge";
import { VideoIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useConfirm } from "@/hooks/use-confirmation";
import { useState } from "react";
import UpdateAgentDialog from "../../components/update-agents-dialog";

interface Props {
  agentId: string;
}

const AgentIdView = ({ agentId }: Props) => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [updateAgentDialog, setUpdateAgentDialog] = useState(false);
  const trpc = useTRPC();
  const { data } = useSuspenseQuery(
    trpc.agents.getONe.queryOptions({ id: agentId })
  );

  const removeAgent = useMutation(
    trpc.agents.remove.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(
          trpc.agents.getMany.queryOptions({})
        );
        // TODO: invalidate free tier usage
        router.push("/agents");
      },
      onError: (error) => {
        toast.error(error.message);
      },
    })
  );

  const [RemoveConfirmation, confirmRemove] = useConfirm(
    "Are you sure?",
    `The Following action will remove ${data.meetingCount} associate meeting`
  );

  const handleRemoveAgent = async () => {
    const ok = await confirmRemove();

    if (!ok) {
      return;
    }

    await removeAgent.mutate({ id: agentId });
  };

  return (
    <>
      <RemoveConfirmation />
      <UpdateAgentDialog
        initialValue={data}
        open={updateAgentDialog}
        onOpenChange={setUpdateAgentDialog}
      />
      <div className="flex-1 py-4 px-4 md:px-8 flex flex-col gap-y-4">
        <AgentIdViewHeader
          agentId={agentId}
          agentName={data?.name}
          onEdit={() => setUpdateAgentDialog(true)}
          onRemove={handleRemoveAgent}
        />
        <div className="bg-white p-4 rounded-lg border">
          <div className="py-5 flex flex-col col-span-5">
            <div className="flex items-center gap-x-3">
              <GeneratedAvatar
                variant="botttsNeutral"
                seed={data?.name}
                className="size-10"
              />
              <h2 className="font-medium text-2xl">{data?.name}</h2>
            </div>
          </div>
          <Badge
            variant={"outline"}
            className="flex items-center gap-x-2 [&>svg]:size-4"
          >
            <VideoIcon className="text-blue-500" />
            {data.meetingCount}{" "}
            {data.meetingCount === 1 ? "meeting" : "meetings"}
          </Badge>
          <div className="flex flex-col gap-y-4">
            <p className="text-lg font-medium">Instructions</p>
            <p className="text-neutral-800">{data.instructions}</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default AgentIdView;

export const AgentIdViewLoading = () => {
  return (
    <LoadingState
      title="Loading Agent"
      description="This may take a few second"
    />
  );
};

export const AgentIdViewError = () => {
  return (
    <ErrorState title="Agent Loading failed" description="Try again later" />
  );
};
