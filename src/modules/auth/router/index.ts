import { db } from "@/db";
import { pages } from "@/db/schema";
import { onboardingSchema } from "@/schemas";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";

export const userRouter = createTRPCRouter({
  onboard: protectedProcedure.input(onboardingSchema).mutation(async (opts) => {
    const [page] = await db
      .insert(pages)
      .values({
        user_id: Number(opts.ctx.session.user.id),
        username: opts.input.username,
        base_template: opts.input.base_template,
        definition: "Hellow",
      })
      .returning();

    return {
      success: true,
      message: "User onboarded successfuly!",
      data: page,
    };
  }),
});
