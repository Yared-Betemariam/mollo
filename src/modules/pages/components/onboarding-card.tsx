"use client";

import { TemplateGrid } from "@/components/custom/template-grid";
import Logo from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { OnboardingFormData, onboardingSchema } from "@/schemas";
import { trpc } from "@/trpc/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useDebounce } from "use-debounce";

export default function OnboardingCard() {
  const utils = trpc.useUtils();
  const { mutate, isPending } = trpc.users.onboard.useMutation({
    onSuccess: () => {
      utils.pages.user.invalidate();
    },
    onError: () => {
      toast.error("Onboarding failed! Try again");
    },
  });

  const form = useForm<OnboardingFormData>({
    resolver: zodResolver(onboardingSchema),
    defaultValues: {
      username: "",
      base_template: "",
    },
  });

  const watchedUsername = form.watch("username");
  const [debouncedUsername] = useDebounce(watchedUsername, 2000);

  const { data: usernameStatus, isFetching: isCheckingUsername } =
    trpc.pages.checkUsernameStatus.useQuery(
      { username: debouncedUsername },
      {
        enabled: !!debouncedUsername && !form.formState.errors.username,
      }
    );

  const handleSubmit = (data: OnboardingFormData) => {
    if (isCheckingUsername) {
      toast.error("Please wait while we check the username availability.");
      return;
    }

    if (usernameStatus?.taken) {
      toast.error("This username is already taken. Please choose another.");
      return;
    }

    mutate(data);
  };

  const handleUsernameChange = (value: string) => {
    const cleanedValue = value.toLowerCase().replace(/[^a-z0-9-]/g, "");
    return cleanedValue;
  };

  return (
    <div className="max-w-2xl mx-auto my-auto py-12 flex flex-col gap-6 w-full">
      <CardHeader className="flex flex-col gap-3">
        <Logo size="lg" className="mb-2" />
        <CardTitle className="h3">Let&apos;s get you all started</CardTitle>
      </CardHeader>

      <CardContent className="space-y-8">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-8"
          >
            {/* Username Section */}
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Choose your username</FormLabel>
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
                  {watchedUsername && !form.formState.errors.username && (
                    <div className="rounded-lg p-2 mt-1">
                      <p className="text-sm opacity-50 mb-1">
                        Your hosing domain will be
                      </p>
                      <div className="flex p-1 px-2 rounded-md bg-primary/10 items-center gap-2">
                        <p className="">{watchedUsername}.mollo.com</p>
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

            {/* Template Selection */}
            <FormField
              control={form.control}
              name="base_template"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-lg font-semibold">
                    Choose your base template
                  </FormLabel>
                  <FormDescription>
                    Select a template that best fits your website&apos;s
                    purpose. You can customize it later.
                  </FormDescription>
                  <FormControl>
                    <TemplateGrid
                      selectedTemplate={field.value}
                      onTemplateSelect={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Submit Button */}
            <Button
              type="submit"
              size="lg"
              className="w-full text-base h-12"
              disabled={
                isPending || !usernameStatus || usernameStatus.taken === true
              }
            >
              {isPending ? "Starting..." : "Start"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </div>
  );
}
