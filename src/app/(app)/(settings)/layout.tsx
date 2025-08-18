type Props = {
  children: React.ReactNode;
};

const Layout = ({ children }: Props) => {
  return (
    <>
      <div>back</div>
      {children}
    </>
  );
};
export default Layout;
