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
  ImageGalleryNode,
  ImageGroup,
  ImageGroupSchema,
} from "@/modules/pages/editor";
import ImageUploadComponent from "@/modules/uploads/components/ImageUpload";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNodesStore } from "../../pages/store";

const ImageGalleryGroupModal = () => {
  const { open, closeModal, data } = useModalStore();
  const { editNode } = useNodesStore();
  const nodeInfo = data as {
    node: ImageGalleryNode; // Replace with your actual node type if needed
    group: ImageGroup | undefined;
  } | null;

  const form = useForm<ImageGroup>({
    resolver: zodResolver(ImageGroupSchema),
    reValidateMode: "onSubmit",
    defaultValues: {
      id: generateId(true),
      imageUrls: [],
    },
  });

  useEffect(() => {
    if (nodeInfo && nodeInfo.group) {
      form.reset({
        id: nodeInfo.group.id ?? generateId(true),
        title: nodeInfo.group.title ?? "",
        imageUrls: nodeInfo.group.imageUrls.length
          ? nodeInfo.group.imageUrls
          : [""],
      });
    } else {
      form.reset({
        id: generateId(true),
      });
    }
  }, [open, nodeInfo?.group]);

  const onSubmit = (values: ImageGroup) => {
    if (!nodeInfo) return;

    if (nodeInfo.group) {
      editNode<ImageGalleryNode>(nodeInfo.node.id, {
        ...nodeInfo.node,
        groups: (nodeInfo.node.groups || []).map((item: ImageGroup) =>
          item.id === nodeInfo.group?.id ? { ...values } : item
        ),
      });
    } else {
      editNode<ImageGalleryNode>(nodeInfo.node.id, {
        ...nodeInfo.node,
        groups: [...(nodeInfo.node.groups || []), values],
      });
    }

    closeModal();
  };

  return (
    <DialogWrapper
      title={nodeInfo?.group ? "Edit Image Group" : "Add Image Group"}
      open={open === "imageGalleryGroup"}
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
              name="imageUrls"
              render={({ field }) => (
                <ImageUploadComponent
                  imageUrls={field.value || []}
                  onChange={(newImgUrls) => field.onChange(newImgUrls)}
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

export default ImageGalleryGroupModal;
