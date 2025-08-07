import { Button } from "@/components/ui/button";
import {
  Command,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Select } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { Check, LucideProps } from "lucide-react";
import React, { useState } from "react";
import { FaSortDown } from "react-icons/fa";

type Option = {
  label: string;
  value: string;
};

type DropdownProps = {
  options: Option[];
  value?: string;
  onChange: (value: string) => void;
  placeholder?: string;
  ghost?: boolean;
  className?: string;
  label?: string;
  icon?: React.ForwardRefExoticComponent<
    Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>
  >;
} & React.ComponentPropsWithoutRef<typeof Select>;

const Dropdown: React.FC<DropdownProps> = ({
  options,
  value,
  ghost,
  label,
  onChange,
  placeholder = "Select",
  className,
  icon: Icon,
  ...props
}) => {
  const [open, setOpen] = useState(false);
  const DropdownCpt = (
    <Popover modal open={open} onOpenChange={setOpen}>
      <PopoverTrigger disabled={props.disabled} asChild>
        <Button
          role="combobox"
          disabled={props.disabled}
          variant={"outline"}
          aria-expanded={props.open}
          className={cn(
            "gap-0 h-10 items-center font-normal justify-start relative",
            ghost &&
              "bg-transparent px-1.5! h-8 font-normal text-sm! shadow-none border-none rounded-none",
            className
          )}
        >
          {Icon && <Icon className="size-5 text-black opacity-50 mr-2" />}

          {value
            ? options.find((option) => option.value === value)?.label
            : placeholder}
          <FaSortDown className="size-5 mb-1.5 ml-auto" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        align="end"
        collisionPadding={10}
        className="min-w-[12rem] w-full p-0"
      >
        <Command>
          <CommandList>
            <CommandGroup className="p-0 py-2">
              {options.map((option) => (
                <CommandItem
                  key={option.value}
                  value={option.value}
                  className="py-2 px-4"
                  onSelect={(currentValue) => {
                    onChange(currentValue === value ? "" : currentValue);
                    setOpen(false);
                  }}
                >
                  {option.label}
                  <Check
                    className={cn(
                      "ml-auto",
                      value === option.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
  return label ? (
    <div className="flex flex-col gap-1 min-w-40">
      <label className="opacity-70">{label}</label>
      {DropdownCpt}
    </div>
  ) : (
    DropdownCpt
  );
};

export default Dropdown;
