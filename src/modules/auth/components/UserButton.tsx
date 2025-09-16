"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CreditCard, LogOut, Settings } from "lucide-react";
import { signOut } from "next-auth/react";
import Link from "next/link";
import { useState } from "react";
import { GoPerson } from "react-icons/go";
import { useUser } from "../hooks";

const UserButton = () => {
  const { user, isLoading } = useUser();
  const [signingOut, setSigningOut] = useState(false);

  const handleLogout = async () => {
    setSigningOut(true);

    await signOut({
      redirectTo: "/signin",
    });

    setSigningOut(false);
  };

  if (isLoading) {
    return (
      <div className="p-1">
        <Avatar className="animate-pulse rounded-full">
          <AvatarFallback className="bg-zinc-800/30 rounded-full" />
        </Avatar>
      </div>
    );
  }

  if (!user) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="w-fit flex items-center gap-1 p-1 ring-2 ring-transparent hover:ring-zinc-300/25 duration-100 transition-all rounded-full flex-row-reverse">
        <div className="bg-gradient-to-br from-blue-900 to-primary rounded-full size-8 text-white relative overflow-hidden grid place-content-center">
          <GoPerson className="size-5" />
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        sideOffset={12}
        align="start"
        className="min-w-[14rem] mx-2 px-0 flex flex-col"
      >
        <div className="px-3 tracking-tight flex items-center gap-2  pt-2 pb-2">
          <GoPerson className="rounded-full aspect-square bg-zinc-200 border border-zinc-500/50 p-0.5 text-zinc-600 size-5" />
          <p className="text-base tracking-tight opacity-80 ">{user.email}</p>
        </div>
        <div className="px-3 pb-2 flex items-center justify-between border-b">
          <span className="text-muted-foreground text-sm">Plan</span>
          <Link
            href={"/billing"}
            className="border border-blue-800/20 bg-blue-50 text-sm font-medium px-3 h-7 flex items-center ml-auto rounded-full text-blue-800  drop-shadow-[2px_2px] drop-shadow-blue-800/25"
          >
            <span>Upgrade</span>
          </Link>
        </div>
        <Link href={"/settings"} className="mt-1">
          <DropdownMenuItem className="h-8 rounded-none px-4">
            <Settings className="mr-1 size-3.5" />
            <span>Settings</span>
          </DropdownMenuItem>
        </Link>
        <Link href={"/billing"}>
          <DropdownMenuItem className="h-8 rounded-none px-4">
            <CreditCard className="mr-1 size-3.5" />
            <span>Billing</span>
          </DropdownMenuItem>
        </Link>

        <span className="border-b my-1" />
        <DropdownMenuItem
          disabled={signingOut}
          onClick={() => handleLogout()}
          className="h-8 rounded-none px-4 text-destructive! hover:bg-red-800/5! hover:text-destructive!"
        >
          <LogOut className="mr-1 size-3.5 text-destructive! hover:text-destructive!" />
          <span>{signingOut ? "logging out..." : "Logout"}</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
export default UserButton;
