"use client";

import { usePage } from "@/modules/pages/hooks";
import { updatePageSchema } from "@/schemas";
import { trpc } from "@/trpc/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";
import { useDebounce } from "use-debounce";
import FormButton, {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import z from "zod";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { TemplateGrid } from "@/components/custom/template-grid";
import { fontTheme } from "@/lib/fonts";
import NeedCustomDomain from "@/components/custom/need-domain";

const Page = () => {
  const { page } = usePage();
  const utils = trpc.useUtils();

  const form = useForm<z.infer<typeof updatePageSchema>>({
    resolver: zodResolver(updatePageSchema),
    disabled: !page,
    defaultValues: {
      published: page?.published || false,
      template: page?.definition.template || "primary",
      username: page?.username || "",
      nodes: page?.definition.nodes || [],
    },
  });

  useEffect(() => {
    if (page) {
      form.reset({
        username: page.username,
        template: page.definition.template,
        published: page.published,
        nodes: page.definition.nodes,
      });
    }
  }, [page]);

  const { mutate, isPending } = trpc.pages.update.useMutation({
    onError: (er) => {
      console.log(er);
      toast.error("Error updating page! Try again");
    },
    onSuccess: () => {
      toast.success("Page updated successfully!");
      utils.pages.user.invalidate();
    },
  });

  const username = useWatch({
    control: form.control,
    name: "username",
  });
  const [debouncedUsername] = useDebounce(username, 1000);

  const { data: usernameStatus, isFetching: isCheckingUsername } =
    trpc.pages.checkUsernameStatus.useQuery(
      { username: debouncedUsername },
      {
        enabled: !!debouncedUsername && !form.formState.errors.username,
      }
    );

  const handleSubmit = (data: z.infer<typeof updatePageSchema>) => {
    if (!page) {
      toast.error("Page not found!");
      return;
    }

    if (
      isCheckingUsername ||
      usernameStatus === undefined ||
      debouncedUsername !== username
    ) {
      toast.error("Please wait while we check the username availability.");
      return;
    }
    if (usernameStatus?.taken && page.username !== debouncedUsername) {
      toast.error("This username is already taken. Please choose another.");
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
      <div className="wrapper flex flex-col md:flex-row md:items-center justify-between py-10 gap-4 md:gap-2">
        <h1 className={cn("h3", fontTheme.className)}>Settings & Hosting</h1>

        <FormButton
          small
          className="w-fit rounded-lg ml-auto bg-gradient-to-br from-zinc-500/90 border-white/25 to-zinc-800/90"
          label="Save changes"
          loading={isPending}
          onClick={() => {
            form.handleSubmit(handleSubmit)();
          }}
        />
      </div>
      <div className="wrapper flex gap-12 pb-12 flex-col">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="flex flex-col border-t pt-12  gap-4"
          >
            <div className="flex flex-col md:flex-row gap-12 justify-between">
              <div className="flex flex-col gap-8 flex-1 max-w-2/5">
                <span className="h5 opacity-85">General</span>

                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem className="h-fit">
                      <FormLabel>Username</FormLabel>
                      <FormControl>
                        <Input
                          maxLength={20}
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

                      {page &&
                        field.value &&
                        !form.formState.errors.username && (
                          <div className="rounded-lg py-2 mt-1">
                            <p className="text-sm opacity-50 mb-1">
                              Your hosing domain will be
                            </p>
                            <div className="flex p-1.5 px-2.5 rounded-md bg-primary/[7.5%] items-center gap-2">
                              <p className="">{field.value}.mollo.com</p>
                            </div>
                            <div className="mt-1 text-sm brightness-75">
                              {isCheckingUsername ||
                              debouncedUsername !== username ? (
                                <p className="text-muted-foreground">
                                  Checking availability...
                                </p>
                              ) : debouncedUsername &&
                                usernameStatus &&
                                usernameStatus.taken &&
                                page.username !== field.value ? (
                                <p className="text-red-500">
                                  This username is taken.
                                </p>
                              ) : debouncedUsername &&
                                usernameStatus &&
                                usernameStatus.taken === false ? (
                                <p className="text-green-500">
                                  This username is available!
                                </p>
                              ) : page.username === field.value ? (
                                <p className="text-green-500">
                                  Current username
                                </p>
                              ) : null}
                            </div>
                          </div>
                        )}
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex flex-col gap-8 flex-1">
                <span className="h5 opacity-85">Base template</span>
                <FormField
                  control={form.control}
                  name="template"
                  render={({ field }) => (
                    <FormItem className="h-fit">
                      <FormControl>
                        <TemplateGrid
                          selectedTemplate={field.value || ""}
                          onTemplateSelect={field.onChange}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </form>
        </Form>

        <span className="border-t" />
        <NeedCustomDomain />
      </div>
    </>
  );
};

export default Page;
