import { Suspense } from "react";

type Props = {
  children: React.ReactNode;
};

const Layout = async ({ children }: Props) => {
  return <Suspense>{children}</Suspense>;
};
export default Layout;
