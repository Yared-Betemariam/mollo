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
import { SkillItem, SkillItemSchema, SkillsNode } from "../../pages/editor";
import { useNodesStore } from "../../pages/store";
import { PercentageSlider } from "@/components/custom/PercentageSlider";

const SkillsModal = () => {
  const { open, closeModal, data } = useModalStore();
  const { editNode } = useNodesStore();
  const nodeInfo = data as {
    node: SkillsNode;
    skill: SkillItem | undefined;
  } | null;

  const form = useForm<SkillItem>({
    resolver: zodResolver(SkillItemSchema),
    reValidateMode: "onSubmit",
    defaultValues: {
      id: generateId(true),
      proficiency: "0",
    },
  });

  useEffect(() => {
    if (nodeInfo && nodeInfo.skill?.id) {
      form.reset({
        id: nodeInfo.skill.id ?? generateId(true),
        name: nodeInfo.skill.name ?? "",
        proficiency: nodeInfo.skill.proficiency ?? 0,
      });
    } else {
      form.reset({
        id: generateId(true),
        proficiency: "0",
      });
    }
  }, [nodeInfo]);

  const onSubmit = (values: SkillItem) => {
    if (!nodeInfo) return;

    if (nodeInfo.skill) {
      editNode<SkillsNode>(nodeInfo.node.id, {
        ...nodeInfo.node,
        skills: nodeInfo.node.skills.map((item) =>
          item.name === nodeInfo.skill?.name ? { ...values } : item
        ),
      });
    } else {
      editNode<SkillsNode>(nodeInfo.node.id, {
        ...nodeInfo.node,
        skills: [...nodeInfo.node.skills, values],
      });
    }

    closeModal();
  };

  return (
    <DialogWrapper
      title={nodeInfo?.skill ? "Edit Skill" : "Add Skill"}
      open={open == "skill"}
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
                  <FormLabel>Skill Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="proficiency"
              render={({ field }) => (
                <PercentageSlider
                  label="Proficiency"
                  value={Number(field.value)}
                  onChange={(value) => field.onChange(value.toString())}
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
export default SkillsModal;
