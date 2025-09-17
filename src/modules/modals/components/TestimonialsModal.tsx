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
  Testimonial,
  TestimonialSchema,
  TestimonialsNode,
} from "../../pages/editor";
import { useNodesStore } from "../../pages/store";
import ValueChanger from "../../pages/components/PropEditor/ValueChanger";

const TestimonialsModal = () => {
  const { open, closeModal, data } = useModalStore();
  const { editNode } = useNodesStore();
  const nodeInfo = data as {
    node: TestimonialsNode;
    testimonial: Testimonial | undefined;
  } | null;

  const form = useForm<Testimonial>({
    resolver: zodResolver(TestimonialSchema),
    reValidateMode: "onSubmit",
    defaultValues: {
      id: generateId(true),
    },
  });

  useEffect(() => {
    if (nodeInfo && nodeInfo.testimonial?.id) {
      form.reset({
        id: nodeInfo.testimonial.id ?? generateId(true),
        name: nodeInfo.testimonial.name ?? undefined,
        feedback: nodeInfo.testimonial.feedback ?? undefined,
        picture: nodeInfo.testimonial.picture ?? undefined,
        jobDescription: nodeInfo.testimonial.jobDescription ?? undefined,
      });
    } else {
      form.reset({
        id: generateId(true),
      });
    }
  }, [open, nodeInfo?.testimonial]);

  const onSubmit = (values: Testimonial) => {
    if (!nodeInfo) return;

    if (nodeInfo.testimonial) {
      editNode<TestimonialsNode>(nodeInfo.node.id, {
        ...nodeInfo.node,
        testimonials: nodeInfo.node.testimonials.map((item) =>
          item.id === nodeInfo.testimonial?.id ? { ...values } : item
        ),
      });
    } else {
      editNode<TestimonialsNode>(nodeInfo.node.id, {
        ...nodeInfo.node,
        testimonials: [...nodeInfo.node.testimonials, values],
      });
    }

    closeModal();
  };

  return (
    <>
      <DialogWrapper
        title={nodeInfo?.testimonial ? "Edit Testimonial" : "Add Testimonial"}
        open={open == "testimonial"}
        onOpen={() => closeModal()}
      >
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="px-6 space-y-4">
              <div className="grid grid-cols-2 gap-2">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input placeholder="John Doe" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="jobDescription"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Input placeholder="Technical Engineer" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="feedback"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Feedback</FormLabel>
                    <FormControl>
                      <ValueChanger
                        type="textarea"
                        placeHolder="Good work! He did a great job."
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
    </>
  );
};
export default TestimonialsModal;
