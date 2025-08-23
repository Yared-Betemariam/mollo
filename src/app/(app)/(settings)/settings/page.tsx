"use client";

import { usePage } from "@/modules/pages/hooks";
import { updatePageSchema } from "@/schemas";
import { trpc } from "@/trpc/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useDebounce } from "use-debounce";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import z from "zod";
import { Input } from "@/components/ui/input";

const Page = () => {
  const { page } = usePage();
  const utils = trpc.useUtils();

  const form = useForm<z.infer<typeof updatePageSchema>>({
    resolver: zodResolver(updatePageSchema),
  });

  useEffect(() => {
    if (page) {
      form.reset({
        username: page.username,
        base_template: page.base_template,
        published: page.published,
      });
    }
  }, [page]);

  const { mutate } = trpc.pages.update.useMutation({
    onError: (er) => {
      console.log(er);
      toast.error("Error updating page! Try again");
    },
    onSuccess: () => {
      toast.success("Page updated successfully!");
      utils.pages.user.invalidate();
    },
  });

  const [debouncedUsername] = useDebounce(form.watch("username"), 2000);

  const { data: usernameStatus, isFetching: isCheckingUsername } =
    trpc.pages.checkUsernameStatus.useQuery(
      { username: debouncedUsername },
      {
        enabled: !!debouncedUsername && !form.formState.errors.username,
      }
    );

  const handleSubmit = (data: z.infer<typeof updatePageSchema>) => {
    if (isCheckingUsername) {
      toast.error("Please wait while we check the username availability.");
      return;
    }

    if (usernameStatus?.taken) {
      toast.error("This username is already taken. Please choose another.");
      return;
    }

    if (!page) {
      toast.error("Page not found!");
      return;
    }

    mutate({ ...data, id: page.id });
  };

  const handleUsernameChange = (value: string) => {
    const cleanedValue = value.toLowerCase().replace(/[^a-z0-9-]/g, "");
    return cleanedValue;
  };

  return (
    <>
      <div className="border-b">
        <div className="wrapper flex flex-col py-6 gap-2">
          <h1 className="h3">Settings</h1>
          <p className="">Update your page information</p>
        </div>
      </div>
      <div className="py-6">
        <div className="wrapper flex gap-8 flex-col">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="flex w-fit flex-col gap-4"
            >
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter your username"
                        {...field}
                        onChange={(e) => {
                          const cleanedValue = handleUsernameChange(
                            e.target.value
                          );
                          field.onChange(cleanedValue);
                        }}
                      />
                    </FormControl>
                    <FormMessage />

                    {/* Subdomain Preview */}
                    {field.value && !form.formState.errors.username && (
                      <div className="rounded-lg p-2 mt-1">
                        <p className="text-sm opacity-50 mb-1">
                          Your hosing domain will be
                        </p>
                        <div className="flex p-1 px-2 rounded-md bg-primary/10 items-center gap-2">
                          <p className="">{field.value}.mollo.com</p>
                        </div>
                        <div className="mt-1 brightness-75">
                          {isCheckingUsername ? (
                            <p className="text-xs text-muted-foreground">
                              Checking availability...
                            </p>
                          ) : debouncedUsername && usernameStatus?.taken ? (
                            <p className="text-xs text-red-500">
                              This username is taken.
                            </p>
                          ) : debouncedUsername ? (
                            <p className="text-xs text-green-500">
                              This username is available!
                            </p>
                          ) : null}
                        </div>
                      </div>
                    )}
                  </FormItem>
                )}
              />
            </form>
          </Form>
        </div>
      </div>
    </>
  );
};

export default Page;
