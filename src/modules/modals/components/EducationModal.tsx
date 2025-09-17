import DialogWrapper from "@/components/custom/dialog-wrapper";
import { Button } from "@/components/ui/button";
import { DialogClose, DialogFooter } from "@/components/ui/dialog";
import {
  DatePicker,
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
  EducationItem,
  EducationItemSchema,
  EducationNode,
} from "../../pages/editor";
import { useNodesStore } from "../../pages/store";
import ValueChanger from "../../pages/components/PropEditor/ValueChanger";

const EducationModal = () => {
  const { open, closeModal, data } = useModalStore();
  const { editNode } = useNodesStore();
  const nodeInfo = data as {
    node: EducationNode;
    education: EducationItem | undefined;
  } | null;

  const form = useForm<EducationItem>({
    resolver: zodResolver(EducationItemSchema),
    reValidateMode: "onSubmit",
    defaultValues: {
      id: generateId(true),
    },
  });

  useEffect(() => {
    if (nodeInfo && nodeInfo.education?.id) {
      form.reset({
        id: nodeInfo.education.id ?? generateId(true),
        startDate: nodeInfo.education.startDate ?? "",
        endDate: nodeInfo.education.endDate ?? undefined,
        title: nodeInfo.education.title ?? "",
        description: nodeInfo.education.description ?? "",
      });
    } else {
      form.reset({
        id: generateId(true),
      });
    }
  }, [open, nodeInfo]);

  const onSubmit = (values: EducationItem) => {
    if (!nodeInfo) return;

    if (nodeInfo.education) {
      editNode<EducationNode>(nodeInfo.node.id, {
        ...nodeInfo.node,
        timeline: nodeInfo.node.timeline.map((item) =>
          item.id === nodeInfo.education?.id ? { ...values } : item
        ),
      });
    } else {
      editNode<EducationNode>(nodeInfo.node.id, {
        ...nodeInfo.node,
        timeline: [...nodeInfo.node.timeline, values],
      });
    }

    closeModal();
  };

  return (
    <DialogWrapper
      title={nodeInfo?.education ? "Edit Education" : "Add Education"}
      open={open == "education"}
      onOpen={() => closeModal()}
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="px-6 space-y-4">
            <div className="grid grid-cols-2 gap-2">
              <FormField
                control={form.control}
                name="startDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Start Date</FormLabel>
                    <FormControl>
                      <DatePicker
                        value={field.value}
                        onChange={(e) =>
                          field.onChange(new Date(e as Date).toISOString())
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="endDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>End Date</FormLabel>
                    <FormControl>
                      <DatePicker
                        value={field.value}
                        onChange={(e) =>
                          field.onChange(
                            e ? new Date(e as Date).toISOString() : undefined
                          )
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
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

export default EducationModal;
