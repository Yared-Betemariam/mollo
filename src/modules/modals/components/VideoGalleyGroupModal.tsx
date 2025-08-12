import DialogWrapper from "@/components/custom/dialog-wrapper";
import { Button } from "@/components/ui/button";
import { DialogClose, DialogFooter } from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { generateId } from "@/lib/utils";
import { useModalStore } from "@/modules/modals/store";
import {
  VideoGalleryNode,
  VideoGroup,
  VideoGroupSchema,
} from "@/modules/pages/editor";
import VideoUploadComponent from "@/modules/uploads/components/VideoUpload";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNodesStore } from "../../pages/store";

const VideoGalleryGroupModal = () => {
  const { open, closeModal, data } = useModalStore();
  const { editNode } = useNodesStore();
  const nodeInfo = data as {
    node: VideoGalleryNode;
    group: VideoGroup | undefined;
  } | null;

  const form = useForm<VideoGroup>({
    resolver: zodResolver(VideoGroupSchema),
    reValidateMode: "onSubmit",
    defaultValues: {
      id: generateId(true),
      videoUrls: [],
    },
  });

  useEffect(() => {
    if (nodeInfo && nodeInfo.group) {
      form.reset({
        id: nodeInfo.group.id ?? generateId(true),
        title: nodeInfo.group.title ?? "",
        videoUrls: nodeInfo.group.videoUrls.length
          ? nodeInfo.group.videoUrls
          : [""],
      });
    } else {
      form.reset({
        id: generateId(true),
      });
    }
  }, [open, nodeInfo?.group]);

  const onSubmit = (values: VideoGroup) => {
    if (!nodeInfo) return;

    if (nodeInfo.group) {
      editNode<VideoGalleryNode>(nodeInfo.node.id, {
        ...nodeInfo.node,
        groups: (nodeInfo.node.groups || []).map((item: VideoGroup) =>
          item.id === nodeInfo.group?.id ? { ...values } : item
        ),
      });
    } else {
      editNode<VideoGalleryNode>(nodeInfo.node.id, {
        ...nodeInfo.node,
        groups: [...(nodeInfo.node.groups || []), values],
      });
    }

    closeModal();
  };

  return (
    <DialogWrapper
      title={nodeInfo?.group ? "Edit Video Group" : "Add Video Group"}
      open={open === "videoGalleryGroup"}
      onOpen={() => closeModal()}
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="px-6 space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="videoUrls"
              render={({ field }) => (
                <VideoUploadComponent
                  videoUrls={field.value || []}
                  onChange={(newVidUrls) => field.onChange(newVidUrls)}
                />
              )}
            />
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant={"outline"}>
                Close
              </Button>
            </DialogClose>
            <Button type="submit">Save</Button>
          </DialogFooter>
        </form>
      </Form>
    </DialogWrapper>
  );
};

export default VideoGalleryGroupModal;
