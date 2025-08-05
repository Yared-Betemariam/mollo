"use client";

import Loader from "@/components/custom/loader";
import { usePage } from "@/modules/pages/hooks";
import { defaultLoginRedirect } from "@/routes";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

type Props = {
  children: React.ReactNode;
};

const DashboardWrapper = ({ children }: Props) => {
  const { page, isLoading } = usePage();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isLoading && !page) {
      router.push("/onboarding");
    }

    if (pathname == "/onboarding" && page) {
      router.push(defaultLoginRedirect);
    }
  }, [isLoading, page, pathname]);

  if (isLoading) {
    return <Loader />;
  }

  return (
    <main id="wrapper" className="flex flex-col flex-1 h-full">
      {children}
    </main>
  );
};

export default DashboardWrapper;
