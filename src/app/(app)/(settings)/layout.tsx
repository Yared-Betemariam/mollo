"use client";

import Logo from "@/components/Logo";
import UserButton from "@/modules/auth/components/UserButton";
import HeaderWrapper from "@/modules/dashboard/components/HeaderWrapper";
import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";

type Props = {
  children: React.ReactNode;
};

const Layout = ({ children }: Props) => {
  const router = useRouter();
  return (
    <>
      <HeaderWrapper wrapper className="gap-8">
        <span
          onClick={() => {
            router.back();
          }}
          className="flex items-center hover:opacity-80 text-blue-700/90 border-none text-sm cursor-pointer -space-x-2"
        >
          <ChevronLeft className="size-8! opacity-85" />
          <span>Back</span>
        </span>
        <Logo logo />
        <span className="ml-auto" />

        <UserButton />
      </HeaderWrapper>
      {children}
    </>
  );
};
export default Layout;
