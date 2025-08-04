import Logo from "@/components/Logo";
import { cn } from "@/lib/utils";

const Heading = ({
  label,
  center,
  error,
}: {
  label?: string;
  center?: boolean;
  error?: boolean;
}) => {
  return (
    <div
      className={cn(
        "flex flex-col gap-4 mb-1",
        center && "justify-center items-center",
        error && ""
      )}
    >
      <Logo size="lg" className="mb-4" />
      <h2 className={cn("h2", error && "h3 text-destructive brightness-75")}>
        {label}
      </h2>
    </div>
  );
};
export default Heading;
