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

export type OnboardingFormData = z.infer<typeof onboardingSchema>;

// export const accountSchema = z.object({
//   name: z.string().max(255).min(1, "Name is required"),
//   balance: z
//     .string()
//     .min(1, { message: "Balance is required" })
//     .regex(/^[-+]?(?:\d+|\d*\.\d+)$/, "PNL must be a valid number")
//     .or(z.literal("")),
//   description: z.string().optional(),
// });

// export type AccountFormValues = z.infer<typeof accountSchema>;

// export const tradeSchema = z.object({
//   account_id: z.number().min(1, "Account is required"),
//   pair: z.string().max(20).min(1, "Pair is required"),
//   date: z.date(),
//   position: z.string().max(50).min(1, "Position is required"),
//   outcome: z.string().optional(),
//   pnl: z
//     .string()
//     .regex(/^[-+]?(?:\d+|\d*\.\d+)$/, "PNL must be a valid number")
//     .optional()
//     .or(z.literal("")),
//   chart: z.string().optional(),
//   notes: z.string().optional(),
//   tags: z.array(z.string()).optional(),
// });

// export type TradeFormValues = z.infer<typeof tradeSchema>;

// export const chatSchema = z.object({
//   name: z.string().min(1, "Name is required"),
//   messages: z.string().min(1, "Messages are required"),
//   account_id: z.number().min(1, "Account is required"),
// });

// export type ChatFormValues = z.infer<typeof chatSchema>;
