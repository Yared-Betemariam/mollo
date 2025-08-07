import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { HexAlphaColorPicker } from "react-colorful";

const ColorPicker = ({
  color,
  onChange,
  label,
}: {
  color: string;
  onChange: (val: string) => void;
  label?: string;
}) => {
  return (
    <div className="flex flex-col gap-1 max-w-40">
      {label && <label className="opacity-70">{label}</label>}
      <div className="flex items-center bg-white border border-stone-900/20 rounded-lg gap-2">
        <Popover>
          <PopoverTrigger asChild className="h-full">
            <Button
              variant="ghost"
              className="flex h-full flex-col border-0 size-9 shrink-0 items-center justify-center overflow-hidden rounded-l-lg border-r border-stone-900/15 p-0 rounded-r-none"
            >
              <div
                className="h-full w-full"
                style={{
                  backgroundColor: color,
                }}
              />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-60 ml-2">
            <HexAlphaColorPicker
              color={color}
              onChange={(n) => {
                onChange(n);
              }}
            />
          </PopoverContent>
        </Popover>
        <Input
          value={color ? color.split("#")[1].toUpperCase() || "FFF" : "FFF"}
          onChange={(e) => onChange("#" + e.target.value)}
          className="border-none rounded-none focus-visible:outline-none active:outline-none focus-visible:ring-0 h-8 focus-visible:ring-transparent rounded-r-lg bg-transparent p-0"
        />
      </div>
    </div>
  );
};
export default ColorPicker;
