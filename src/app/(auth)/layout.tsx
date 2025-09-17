import { Suspense } from "react";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <Suspense>
      <main className="flex flex-col items-center justify-center min-h-screen">
        {children}
      </main>
    </Suspense>
  );
};

export default Layout;
