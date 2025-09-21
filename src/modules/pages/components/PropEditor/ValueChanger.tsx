import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import Textarea from "react-textarea-autosize";

type Props = {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  type?: "textarea" | "input";
  className?: string;
  placeHolder?: string;
  long?: boolean;
};

const ValueChanger = ({
  type = "input",
  label,
  value,
  onChange,
  long,
  className,
  placeHolder,
}: Props) => {
  return (
    <div className={cn("flex flex-col gap-1", className)}>
      {label && (
        <label htmlFor={label} className="opacity-70">
          {label}
        </label>
      )}
      {type == "input" ? (
        <Input
          id={label}
          placeholder={placeHolder}
          className="shadow-none bg-zinc-900/[0.025]"
          onChange={(e) => onChange(e.target.value)}
          value={value}
        />
      ) : (
        <Textarea
          rows={long ? 4 : 2}
          maxRows={long ? 5 : 2}
          id={label}
          placeholder={placeHolder}
          className="file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex min-h-16 w-full min-w-0 rounded-md border px-3 py-1.5 text-base transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm shadow-none bg-zinc-900/[0.025]"
          onChange={(e) => onChange(e.target.value)}
          value={value}
        />
      )}
    </div>
  );
};

export default ValueChanger;
