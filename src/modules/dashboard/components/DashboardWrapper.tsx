import UserButton from "@/modules/auth/components/UserButton";

type Props = {
  children: React.ReactNode;
};

const DashboardWrapper = ({ children }: Props) => {
  return (
    <main id="wrapper" className="flex flex-col flex-1 h-full">
      <UserButton />
      {children}
    </main>
  );
};

export default DashboardWrapper;
