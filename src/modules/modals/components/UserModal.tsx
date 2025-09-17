import DialogWrapper from "@/components/custom/dialog-wrapper";
import Dropdown from "@/components/custom/dropdown";
import { Calendar28 } from "@/components/custom/input-calendar";
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import FormButton, {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { SheetClose } from "@/components/ui/sheet";
import { User } from "@/db/schema";
import { updateUserSchema } from "@/schemas";
import { trpc } from "@/trpc/client";
import { Plan, Status } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { useModalStore } from "../store";

const UserModal = () => {
  const { open, closeModal, data } = useModalStore();
  const utils = trpc.useUtils();
  const user = data as User | null;

  const form = useForm<z.infer<typeof updateUserSchema>>({
    resolver: zodResolver(updateUserSchema),
    reValidateMode: "onSubmit",
    defaultValues: {
      id: user?.id || undefined,
    },
  });

  useEffect(() => {
    if (user) {
      form.reset({
        id: user.id,
        plan: user.plan,
        status: user.status,
        subscription_end_date: user.subscription_end_date,
      });
    } else {
      form.reset();
    }
  }, [user]);

  const { mutate, isPending } = trpc.admin.updateUser.useMutation({
    onSuccess: () => {
      toast.success("User updated successfully!");
      utils.admin.users.invalidate();

      closeModal();
    },
    onError: (error) => {
      console.error("Error updating user:", error);
      toast.error("Failed to update user. Please try again.");
    },
  });

  const handleSubmit = async (values: z.infer<typeof updateUserSchema>) => {
    mutate({ ...values, prevPlan: user?.plan });
  };

  if (!user) return null;

  return (
    <DialogWrapper
      open={open == "user"}
      onOpen={() => closeModal()}
      title={"Edit user"}
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          <div className="flex flex-col gap-6 px-6">
            <div className="grid grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="plan"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Plan</FormLabel>
                    <FormControl>
                      <Dropdown
                        options={[
                          {
                            label: "Free",
                            value: "free",
                          },
                          {
                            label: "Starter",
                            value: "starter",
                          },
                          {
                            label: "Pro",
                            value: "pro",
                          },
                          {
                            label: "Premium",
                            value: "premium",
                          },
                        ]}
                        value={field.value}
                        onChange={(e) => field.onChange(e as Plan)}
                        placeholder="Select plan"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <FormControl>
                      <Dropdown
                        options={[
                          {
                            label: "Active",
                            value: "active",
                          },
                          {
                            label: "Disabled",
                            value: "disabled",
                          },
                        ]}
                        value={field.value}
                        onChange={(e) => field.onChange(e as Status)}
                        placeholder="Select status"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
            <div className="flex items-end gap-6">
              <FormField
                control={form.control}
                name="subscription_end_date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Subscription enddate</FormLabel>
                    <FormControl>
                      <Calendar28
                        date={field.value}
                        setDate={(e) => {
                          if (e) {
                            field.onChange(e);
                          }
                        }}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <Button
                type="button"
                onClick={() => form.setValue("subscription_end_date", null)}
                size={"xs"}
              >
                Set <code>null</code>
              </Button>
            </div>
          </div>

          <DialogFooter>
            <SheetClose asChild>
              <Button variant={"outline"}>Cancel</Button>
            </SheetClose>
            <FormButton
              small
              type="submit"
              label={"Save"}
              loading={isPending}
            />
          </DialogFooter>
        </form>
      </Form>
    </DialogWrapper>
  );
};
export default UserModal;
