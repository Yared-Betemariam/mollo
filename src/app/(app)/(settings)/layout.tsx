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
      <HeaderWrapper>
        <Logo logo />
        <p
          onClick={() => {
            router.back();
          }}
          className="flex items-center hover:underline cursor-pointer -space-x-0.5"
        >
          <ChevronLeft className="size-6" />
          <span>Back</span>
        </p>
        <span className="ml-auto" />
        <UserButton />
      </HeaderWrapper>
      {children}
    </>
  );
};
export default Layout;
