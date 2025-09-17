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
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import {
  ProjectItem,
  ProjectItemSchema,
  ProjectsNode,
} from "../../pages/editor";
import { useNodesStore, usePageInfoStore } from "../../pages/store";
import ValueChanger from "../../pages/components/PropEditor/ValueChanger";
import ImagesUploadComponent from "@/modules/uploads/components/ImagesUpload";

const ProjectModal = () => {
  const { open, closeModal, data } = useModalStore();
  const { editNode } = useNodesStore();
  const { info } = usePageInfoStore();
  const nodeInfo = data as {
    node: ProjectsNode;
    project: ProjectItem | undefined;
  } | null;

  const form = useForm<ProjectItem>({
    resolver: zodResolver(ProjectItemSchema),
    reValidateMode: "onSubmit",
    defaultValues: {
      id: generateId(true),
      name: "",
      description: "",
      imageUrls: [],
    },
  });

  useEffect(() => {
    if (nodeInfo && nodeInfo.project?.id) {
      form.reset({
        id: nodeInfo.project.id ?? generateId(true),
        name: nodeInfo.project.name ?? "",
        description: nodeInfo.project.description ?? "",
        imageUrls: nodeInfo.project.imageUrls ?? [],
      });
    } else {
      form.reset({
        id: generateId(true),
        name: "",
        description: "",
        imageUrls: [],
      });
    }
  }, [open]);

  const onSubmit = (values: ProjectItem) => {
    if (!nodeInfo) return;

    if (nodeInfo.project) {
      editNode<ProjectsNode>(nodeInfo.node.id, {
        ...nodeInfo.node,
        projects: nodeInfo.node.projects.map((item) =>
          item.id === nodeInfo.project?.id ? { ...values } : item
        ),
      });
    } else {
      editNode<ProjectsNode>(nodeInfo.node.id, {
        ...nodeInfo.node,
        projects: [...nodeInfo.node.projects, values],
      });
    }

    closeModal();
  };

  return (
    <DialogWrapper
      title={nodeInfo?.project ? "Edit Project" : "Add Project"}
      open={open == "project"}
      onOpen={() => closeModal()}
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="px-6 space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <ValueChanger
                      type="textarea"
                      value={field.value}
                      onChange={(e) => field.onChange(e)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="imageUrls"
              render={({ field }) => (
                <ImagesUploadComponent
                  info={info}
                  imageUrls={field.value}
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

export default ProjectModal;
