import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "../ui/button";
import { Expand } from "lucide-react";
import { cn } from "@/lib/utils";

export function FullscreenMedia({
  src,
  isVideo,
  open,
  onOpen,
  aspect,
}: {
  src: string;
  isVideo?: boolean;
  open?: boolean;
  onOpen?: (value: boolean) => void;
  aspect: number;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpen}>
      <DialogTrigger asChild>
        <Button
          type="button"
          variant="secondary"
          size="icon"
          className="absolute top-4 left-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200 size-10 dark:text-black bg-white hover:bg-white/75 shadow-md z-50!"
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          <Expand size={20} />
        </Button>
      </DialogTrigger>
      <DialogContent className={cn("p-0 rounded-md bg-black/0")}>
        <DialogTitle className="sr-only">Image</DialogTitle>
        {isVideo ? (
          <video controls className={cn("rounded-md w-full h-auto")}>
            <source src={src} />
          </video>
        ) : (
          <img
            src={src}
            className={cn(
              "rounded-md",
              aspect > 1
                ? "w-full h-auto"
                : aspect < 1
                ? "h-full w-auto"
                : "h-full w-full"
            )}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
