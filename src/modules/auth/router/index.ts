import { db } from "@/db";
import { pages } from "@/db/schema";
import { getTemplate } from "@/modules/pages/templates";
import { onboardingSchema } from "@/schemas";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { TemplateName } from "@/types";

export const userRouter = createTRPCRouter({
  onboard: protectedProcedure.input(onboardingSchema).mutation(async (opts) => {
    const [page] = await db
      .insert(pages)
      .values({
        user_id: Number(opts.ctx.session.user.id),
        username: opts.input.username,
        base_template: opts.input.base_template,
        definition: {
          nodes: getTemplate(opts.input.base_template as TemplateName),
        },
      })
      .returning();

    return {
      success: true,
      message: "User onboarded successfuly!",
      data: page,
    };
  }),
});
