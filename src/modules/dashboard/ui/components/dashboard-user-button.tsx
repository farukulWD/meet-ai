import { GeneratedAvatar } from "@/components/generated-avatar";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { authClient } from "@/lib/auth-client";

import { ChevronDownIcon, CreditCardIcon, LogOutIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";

function DashboardUserButton() {
  const { data, isPending } = authClient.useSession();
  const router = useRouter();

  if (isPending || !data?.user) {
    return null;
  }
  const handleLogout = async () => {
    authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/sign-in");
        },
      },
    });
  };
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="rounded-lg border border-border/10 p-3 w-full flex items-center justify-between bg-white/5 hover:bg-white/10 gap-2 overflow-hidden cursor-pointer">
        {data?.user?.image ? (
          <Avatar>
            <AvatarImage src={data?.user?.image} alt={data?.user?.name} />
          </Avatar>
        ) : (
          <GeneratedAvatar variant="initials" seed={data?.user?.name} />
        )}
        <div className="flex flex-col gap-0.5 text-left overflow-hidden flex-1  min-w-0">
          <p className="truncate text-sm w-full">{data?.user?.name}</p>
          <p className="truncate text-xs w-full">{data?.user?.email}</p>
        </div>
        <ChevronDownIcon className="size-4 shrink-0" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" side="right" className="w-72">
        <DropdownMenuLabel>
          <div className="flex flex-col gap-1">
            <span className="font-medium truncate">{data?.user?.name}</span>
            <span className="text-sm truncate font-normal text-muted-foreground">
              {data?.user?.email}
            </span>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="flex items-center justify-between cursor-pointer">
          Billing
          <CreditCardIcon className="size-4" />
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={handleLogout}
          className="flex items-center justify-between cursor-pointer"
        >
          Logout
          <LogOutIcon className="size-4" />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default DashboardUserButton;
