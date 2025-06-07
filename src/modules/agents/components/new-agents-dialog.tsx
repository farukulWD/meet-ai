"use client";

import ResponsiveDialog from "@/components/responsive-dialog";
import AgentForm from "./agent-form";

interface NewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function NewAgentDialog({ open, onOpenChange }: NewDialogProps) {
  return (
    <ResponsiveDialog
      open={open}
      title="New agent"
      description="Add new agent"
      onOpenChange={onOpenChange}
    >
      <AgentForm
        onSuccess={() => onOpenChange(false)}
        onCancel={() => onOpenChange(false)}
      />
    </ResponsiveDialog>
  );
}

export default NewAgentDialog;
