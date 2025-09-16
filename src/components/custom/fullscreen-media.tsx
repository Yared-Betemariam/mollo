import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "../ui/button";
import { Expand } from "lucide-react";

export function FullscreenMedia({
  src,
  isVideo,
  open,
  onOpen,
}: {
  src: string;
  isVideo?: boolean;
  open?: boolean;
  onOpen?: (value: boolean) => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpen}>
      <DialogTrigger asChild>
        {/* <Button
          variant="ghost"
          size="icon"
          className="absolute top-2 right-2 bg-white/40"
        >
          <Expand />
        </Button> */}
        <Button
          type="button"
          variant="secondary"
          size="icon"
          className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 h-8 w-8 bg-white/25 hover:bg-white/50 shadow-md"
          onClick={(e) => {
            e.stopPropagation();
            // setPreviewTemplate(template);
          }}
        >
          {/* <Maximize2 size={16} /> */}
          <Expand size={16} />
        </Button>
      </DialogTrigger>
      <DialogContent className="p-0 bg-black/90">
        <DialogTitle className="sr-only">Image</DialogTitle>
        {isVideo ? (
          <video controls className="w-full h-auto">
            <source src={src} />
          </video>
        ) : (
          <img src={src} className="w-full h-auto" />
        )}
      </DialogContent>
    </Dialog>
  );
}
