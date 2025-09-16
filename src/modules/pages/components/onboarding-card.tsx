"use client";

import { TemplateGrid } from "@/components/custom/template-grid";
import Logo from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { fontTheme } from "@/lib/fonts";
import { cn } from "@/lib/utils";
import { OnboardingFormData, onboardingSchema } from "@/schemas";
import { trpc } from "@/trpc/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";
import { useDebounce } from "use-debounce";

export default function OnboardingCard() {
  const utils = trpc.useUtils();
  const { mutate, isPending } = trpc.users.onboard.useMutation({
    onSuccess: () => {
      utils.pages.user.invalidate();
      toast.success("Onboarding successful!");
    },
    onError: (error) => {
      console.log(error);
      toast.error("Onboarding failed! Try again");
    },
  });

  const form = useForm<OnboardingFormData>({
    resolver: zodResolver(onboardingSchema),
    defaultValues: {
      username: "",
      template: "",
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

  const handleSubmit = (data: OnboardingFormData) => {
    if (
      isCheckingUsername ||
      usernameStatus === undefined ||
      debouncedUsername !== username
    ) {
      toast.error("Please wait while we check the username availability.");
      return;
    }

    if (usernameStatus.taken) {
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
    <div className="max-w-md mx-auto my-auto py-12 flex flex-col gap-12 w-full">
      <CardHeader className="flex flex-col items-center gap-3">
        <Logo size="lg" className="mb-2" />
        <CardTitle className={cn("h3", fontTheme.className)}>
          Get started
        </CardTitle>
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
                  <FormLabel className="text-base opacity-90">
                    Choose your username
                  </FormLabel>
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

                  {/* Subdomain Preview */}
                  {field.value && !form.formState.errors.username && (
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
                          usernameStatus.taken ? (
                          <p className="text-red-500">
                            This username is taken.
                          </p>
                        ) : debouncedUsername &&
                          usernameStatus &&
                          usernameStatus.taken === false ? (
                          <p className="text-green-500">
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
              name="template"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base opacity-90">
                    Choose your base template
                  </FormLabel>
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
              disabled={isPending}
            >
              {isPending ? "Starting..." : "Start"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </div>
  );
}
