import { db } from "@/db";
import { pages, users } from "@/db/schema";
import { getTemplate } from "@/modules/pages/templates";
import { onboardingSchema } from "@/schemas";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { TemplateName } from "@/types";
import { eq } from "drizzle-orm";

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
  current: protectedProcedure.query(async (opts) => {
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.id, Number(opts.ctx.session.user.id)));

    return {
      success: true,
      message: "User updated successfuly!",
      data: user,
    };
  }),
});
