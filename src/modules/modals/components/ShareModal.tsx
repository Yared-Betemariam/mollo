import DialogWrapper from "@/components/custom/dialog-wrapper";
import { Button } from "@/components/ui/button";
import { useModalStore } from "@/modules/modals/store";
import { Copy } from "lucide-react";
import { useMemo } from "react";
import { toast } from "sonner";

const ShareModal = () => {
  const { open, closeModal, data } = useModalStore();
  const url = useMemo(() => {
    return `${process.env.NEXT_PUBLIC_BASE_URL}/${data as string}`;
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
        <div className="flex items-center p-1 gap-1 rounded-md bg-black/10">
          <span className="px-3 py-1">{url}</span>
          <Button
            variant="outline"
            size="sm"
            onClick={handleCopy}
            className="ml-auto bg-white/40"
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
