import { cn } from "@/lib/utils";

const HeaderWrapper = ({
  children,
  className,
  wrapper,
}: {
  children: React.ReactNode;
  className?: string;
  wrapper?: boolean;
}) => {
  return (
    <div
      className={cn(
        "min-h-16 flex gap-5 items-center",
        wrapper ? "wrapper" : "px-4 w-full",
        className
      )}
    >
      {children}
    </div>
  );
};

export default HeaderWrapper;
