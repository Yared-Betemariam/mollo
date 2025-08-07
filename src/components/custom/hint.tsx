import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";

type Props = {
  desc: string;
  children: React.ReactNode;
  className?: string;
  contentClassName?: string;
};

const Hint = ({ children, desc, contentClassName, className }: Props) => {
  return (
    <Tooltip>
      <TooltipTrigger className={cn(className)}>{children}</TooltipTrigger>
      <TooltipContent className={cn("max-w-48", contentClassName)} side="right">
        <p>{desc}</p>
      </TooltipContent>
    </Tooltip>
  );
};
export default Hint;
