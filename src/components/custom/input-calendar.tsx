"use client";

import * as React from "react";
import { CalendarIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

function formatDate(date: Date | null) {
  if (!date) {
    return "";
  }

  return date.toLocaleDateString("en-US", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

function isValidDate(date: Date | undefined) {
  if (!date) {
    return false;
  }
  return !isNaN(date.getTime());
}

type Props = {
  date: Date | null;
  setDate: (date: Date | null) => void;
};

export function Calendar28({ date, setDate }: Props) {
  const [open, setOpen] = React.useState(false);
  const [month, setMonth] = React.useState<Date | null>(date);
  const [value, setValue] = React.useState(formatDate(date));

  React.useEffect(() => {
    setValue(formatDate(date));
  }, [date]);

  return (
    <div className="relative flex gap-2">
      <Input
        id="date"
        value={value}
        placeholder="June 01, 2025"
        className="bg-background pr-10"
        onChange={(e) => {
          const date = new Date(e.target.value);
          setValue(e.target.value);
          if (isValidDate(date)) {
            setDate(date);
            setMonth(date);
          }
        }}
        onKeyDown={(e) => {
          if (e.key === "ArrowDown") {
            e.preventDefault();
            setOpen(true);
          }
        }}
      />
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            id="date-picker"
            variant="ghost"
            className="absolute top-1/2 right-2 size-6 -translate-y-1/2"
          >
            <CalendarIcon className="size-3.5" />
            <span className="sr-only">Select date</span>
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="w-auto overflow-hidden p-0"
          align="end"
          alignOffset={-8}
          sideOffset={10}
        >
          <Calendar
            mode="single"
            selected={date || undefined}
            captionLayout="dropdown"
            month={month || undefined}
            onMonthChange={setMonth}
            onSelect={(date) => {
              setDate(date || null);
              setValue(formatDate(date || null));
              setOpen(false);
            }}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
