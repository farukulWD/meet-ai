"use client";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { generateAvatarUri } from "@/lib/avatar";
import {
  DefaultVideoPlaceholder,
  StreamVideoParticipant,
  ToggleAudioPreviewButton,
  ToggleVideoPreviewButton,
  useCallStateHooks,
  VideoPreview,
} from "@stream-io/video-react-sdk";

import "@stream-io/video-react-sdk/dist/css/styles.css";
import { LogInIcon } from "lucide-react";
import Link from "next/link";
interface Props {
  onJoin: () => void;
}

const DisableVideoPreview = () => {
  const { data } = authClient.useSession();

  return (
    <DefaultVideoPlaceholder
      participant={
        {
          name: data?.user.name ?? "",
          image:
            data?.user?.image ??
            generateAvatarUri({
              variant: "initials",
              seed: data?.user.name ?? "",
            }),
        } as StreamVideoParticipant
      }
    />
  );
};

const AllowBrowserPermission = () => {
  return (
    <p className="text">
      Please grant your browser a permission to access your microphone and
      camera
    </p>
  );
};

function CallLobby({ onJoin }: Props) {
  const { useCameraState, useMicrophoneState } = useCallStateHooks();
  const { hasBrowserPermission: hasCameraPermission } = useCameraState();
  const { hasBrowserPermission: hasMicrophonePermission } =
    useMicrophoneState();
  const hasMediaPermissions = hasCameraPermission && hasMicrophonePermission;

  return (
    <div className="flex flex-col h-full justify-center items-center bg-radial from-sidebar-accent to-sidebar">
      <div className="py-4 px-8 flex flex-1 justify-center items-center">
        <div className="flex flex-col gap-y-6 justify-center items-center bg-background p-10 shadow-sm rounded-lg">
          <div className="flex flex-col text-center gap-y-2">
            <h6 className="text-lg font-medium ">Ready to join?</h6>
            <p className="text-sm">Setup your call before joining</p>
          </div>
          <VideoPreview
            DisabledVideoPreview={
              hasMediaPermissions ? DisableVideoPreview : AllowBrowserPermission
            }
          />
          <div className="flex gap-x-2">
            <ToggleAudioPreviewButton />
            <ToggleVideoPreviewButton />
          </div>
          <div className="flex gap-x-2 w-full justify-between">
            <Button asChild variant={"ghost"}>
              <Link href={"/meetings"}> Cancel</Link>
            </Button>
            <Button onClick={onJoin}>
              <LogInIcon /> Join
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CallLobby;
