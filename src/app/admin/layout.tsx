import { Toaster } from "@/components/ui/sonner";
import AdminWrapper from "@/modules/admin/components/AdminWrapper";
import AdminModals from "@/modules/modals/admin";
import { defaultLoginRedirect } from "@/routes";
import { trpc } from "@/trpc/server";
import { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Admin",
};

type Props = {
  children: React.ReactNode;
};

const Layout = async ({ children }: Props) => {
  await trpc.admin.check.call(undefined).catch(() => {
    redirect(defaultLoginRedirect);
  });

  return (
    <>
      <AdminWrapper>{children}</AdminWrapper>
      <AdminModals />
      <Toaster />
    </>
  );
};
export default Layout;
