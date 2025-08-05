import ResizableWrapper from "@/modules/dashboard/components/ResizableWrapper";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = async ({ children }: LayoutProps) => {
  return <ResizableWrapper>{children}</ResizableWrapper>;
};

export default Layout;
