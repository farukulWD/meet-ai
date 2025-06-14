"use client";

import ResponsiveDialog from "@/components/responsive-dialog";
import AgentForm from "./agent-form";
import { TAgentGetOne } from "../types";

interface UpdateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialValue: TAgentGetOne;
}

function UpdateAgentDialog({
  open,
  onOpenChange,
  initialValue,
}: UpdateDialogProps) {
  return (
    <ResponsiveDialog
      open={open}
      title="Edit agent"
      description="Edit the agent details"
      onOpenChange={onOpenChange}
    >
      <AgentForm
        onSuccess={() => onOpenChange(false)}
        onCancel={() => onOpenChange(false)}
        initialValues={initialValue}
      />
    </ResponsiveDialog>
  );
}

export default UpdateAgentDialog;
