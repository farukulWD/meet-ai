"use client";

import ResponsiveDialog from "@/components/responsive-dialog";
import MeetingForm from "./meeting-form";
import { useRouter } from "next/navigation";

interface NewMeetingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function NewMeetingDialog({ open, onOpenChange }: NewMeetingDialogProps) {
  const router = useRouter();
  return (
    <ResponsiveDialog
      open={open}
      title="New Meeting"
      description="Add new meeting"
      onOpenChange={onOpenChange}
    >
      <MeetingForm
        onSuccess={(id) => {
          onOpenChange(false);
          router.push(`/meetings/${id}`);
        }}
        onCancel={() => {
          onOpenChange(false);
        }}
      />
    </ResponsiveDialog>
  );
}

export default NewMeetingDialog;
