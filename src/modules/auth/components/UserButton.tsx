"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CreditCard, LogOut, User } from "lucide-react";
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
        <div className="px-3 tracking-tight flex flex-col mt-1 mb-2">
          <div className="flex items-center text-sm opacity-60 -mb-0.5">
            <User className="size-4 mr-1 inline" /> <span>Email</span>
          </div>
          <p className="font-medium">{user.email}</p>
        </div>
        <Link href={"/billing"}>
          <DropdownMenuItem className="h-8 rounded-none px-4">
            <CreditCard className="mr-1 size-3.5" />
            <span>Billing</span>
          </DropdownMenuItem>
        </Link>
        <DropdownMenuSeparator className="opacity-50" />

        <DropdownMenuItem
          disabled={signingOut}
          onClick={() => handleLogout()}
          className="h-8 rounded-none px-4 text-destructive! hover:text-destructive!"
        >
          <LogOut className="mr-1 size-3.5 text-destructive! hover:text-destructive!" />
          <span>{signingOut ? "logging out..." : "Logout"}</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
export default UserButton;
