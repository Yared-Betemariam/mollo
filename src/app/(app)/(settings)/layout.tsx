"use client";

import Logo from "@/components/Logo";
import { Badge } from "@/components/ui/badge";
import UserButton from "@/modules/auth/components/UserButton";
import HeaderWrapper from "@/modules/dashboard/components/HeaderWrapper";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

type Props = {
  children: React.ReactNode;
};

const Layout = ({ children }: Props) => {
  const router = useRouter();
  return (
    <>
      <HeaderWrapper wrapper className="gap-8">
        <Logo logo />
        <Badge
          onClick={() => {
            router.back();
          }}
          className="flex items-center hover:opacity-80 bg-gradient-to-br text-black border-none shadow h-7 text-sm from-zinc-100 to-zinc-300 cursor-pointer -space-x-1"
        >
          <ChevronLeft className="size-4! opacity-50" />
          <span className="opacity-90">Back</span>
        </Badge>
        <Link
          href={"/help"}
          className="text-lg underline hover:opacity-75 text-blue-800/80 tracking-tighter font-medium"
        >
          Contact support
        </Link>

        <span className="ml-auto" />
        <UserButton />
      </HeaderWrapper>
      {children}
    </>
  );
};
export default Layout;
