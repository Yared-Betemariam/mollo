import Loader from "@/components/custom/loader";
import Logo from "@/components/Logo";
import { Toaster } from "@/components/ui/sonner";
import UserButton from "@/modules/auth/components/UserButton";
import { HydrateClient, trpc } from "@/trpc/server";
import { Metadata } from "next";
import React, { Suspense } from "react";

export const metadata: Metadata = {
  title: "Affiliate",
  description: "Manage you affiliate/refferal statistics and payouts here",
};

const Layout = ({ children }: { children: React.ReactNode }) => {
  void trpc.affiliate.user.prefetch(undefined);

  return (
    <HydrateClient>
      <Toaster />
      <Suspense fallback={<Loader />}>
        <div className="max-w-2xl w-full mx-auto border-x flex-1 h-full flex flex-col">
          <div className="flex w-full h-20 items-center justify-between border-b px-8">
            <Logo />
            <UserButton simple />
          </div>
          {children}
        </div>
      </Suspense>
    </HydrateClient>
  );
};
export default Layout;
