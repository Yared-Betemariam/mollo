import { plansList, statusList } from "@/types";
import { z } from "zod";

export const usernameSchema = z
  .string()
  .min(3, "Username must be at least 3 characters long")
  .max(20, "Username must be less than 20 characters")
  .regex(
    /^[a-z0-9-]+$/,
    "Username can only contain lowercase letters, numbers, and hyphens"
  )
  .refine((val) => !val.startsWith("-") && !val.endsWith("-"), {
    message: "Username cannot start or end with a hyphen",
  });

export const onboardingSchema = z.object({
  username: usernameSchema,
  base_template: z.string().min(1, "Please select a template"),
});

export const updateUserSchema = z.object({
  id: z.number(),
  status: z.enum(statusList),
  plan: z.enum(plansList),
  subscription_end_date: z.date().nullable(),
});

export type OnboardingFormData = z.infer<typeof onboardingSchema>;
export type UpdateUserSchema = z.infer<typeof updateUserSchema>;
