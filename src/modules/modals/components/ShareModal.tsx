import DialogWrapper from "@/components/custom/dialog-wrapper";
import { Button } from "@/components/ui/button";
import { useModalStore } from "@/modules/modals/store";
import { Copy, ExternalLink } from "lucide-react";
import Link from "next/link";
import { useMemo } from "react";
import { toast } from "sonner";

const ShareModal = () => {
  const { open, closeModal, data } = useModalStore();
  const url = useMemo(() => {
    return `https://${data as string}.${process.env.NEXT_PUBLIC_BASE_DOMAIN}`;
  }, [data]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      toast.success("URL copied to clipboard");
    } catch {
      toast.error("Could not copy URL to clipboard");
    }
  };

  if (!data) return null;

  return (
    <DialogWrapper
      title={"Share you website"}
      description="Here is the link to you portfolio website that you created and published!"
      open={open == "share"}
      onOpen={() => closeModal()}
    >
      <div className="flex flex-col gap-1.5 pt-0 p-6">
        <div className="flex items-center p-2 gap-1 rounded-md bg-gradient-to-tl transition-all duration-300 from-zinc-900/[7%] to-blue-800/[12%] hover:from-zinc-900/10 hover:to-blue-800/15">
          <span className="px-3 py-1 font-medium opacity-80">{url}</span>

          <Link href={url} className="ml-auto" target="_blank">
            <Button
              variant="outline"
              size="sm"
              className="bg-transparent shadow-none border-none"
            >
              <ExternalLink className="size-3" />
              <span>Open</span>
            </Button>
          </Link>
          <Button
            variant="outline"
            size="sm"
            onClick={handleCopy}
            className="border-black/15 bg-white/40"
          >
            <Copy className="size-3" />
            <span>Copy</span>
            <span className="sr-only">Copy URL</span>
          </Button>
        </div>
      </div>
    </DialogWrapper>
  );
};
export default ShareModal;
