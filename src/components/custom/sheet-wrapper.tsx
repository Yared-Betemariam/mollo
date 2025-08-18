import { useIsMobile } from "@/hooks/use-mobile";
import React from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

interface SheetWrapperProps {
  side?: "bottom" | "left" | "right";
  open: boolean;
  onOpen: (open: boolean) => void;
  title?: string;
  description?: string;
  children: React.ReactNode;
  previewMode?: boolean;
}

const SheetWrapper: React.FC<SheetWrapperProps> = ({
  side = "right",
  open,
  onOpen,
  title,
  description,
  children,
  previewMode,
}) => {
  const isMobile = useIsMobile();
  return (
    <Sheet open={open} onOpenChange={onOpen}>
      <SheetContent
        side={isMobile ? "bottom" : side}
        className={cn(
          "space-y-0 gap-4",
          isMobile && "max-h-[calc(100vh-2rem)]",
          previewMode && "bg-zinc-100 srounded-t-lg h-full flex flex-col"
        )}
      >
        <SheetHeader className={cn("border-b p-8", previewMode && "sr-only")}>
          <SheetTitle className="text-xl">{title}</SheetTitle>
          <SheetDescription>{description}</SheetDescription>
        </SheetHeader>
        <div
          className={cn(
            previewMode
              ? "flex flex-col justify-between h-full flex-1"
              : "px-8 pb-10 md:pb-12 overflow-auto"
          )}
        >
          {children}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default SheetWrapper;
