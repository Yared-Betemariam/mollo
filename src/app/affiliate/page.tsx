import Logo from "@/components/Logo";
import { Toaster } from "@/components/ui/sonner";
import ClientPage from "@/modules/affiliate/components/Client";
import UserButton from "@/modules/auth/components/UserButton";
import { HydrateClient, trpc } from "@/trpc/server";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Affiliate",
  description: "Manage you affiliate/refferal statistics and payouts here",
};

export default async function Page() {
  const data = await trpc.affiliate.user.call(undefined);

  return (
    <HydrateClient>
      <div className="max-w-2xl w-full mx-auto border-x flex-1 h-full flex flex-col">
        <div className="flex w-full h-20 items-center justify-between border-b px-8">
          <Logo />
          <UserButton simple />
        </div>
        <Toaster />
        <ClientPage affiliate={data.data} />
      </div>
    </HydrateClient>
  );
}
