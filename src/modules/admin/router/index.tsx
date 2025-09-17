import { AFFILIATE_FEE, pricing_plans } from "@/data";
import { db } from "@/db";
import { affiliates, pages, users } from "@/db/schema";
import { updateUserSchema } from "@/schemas";
import { adminProcedure, createTRPCRouter } from "@/trpc/init";
import { plansList } from "@/types";
import { eq, sql } from "drizzle-orm";
import z from "zod";

export const adminRouter = createTRPCRouter({
  users: adminProcedure.query(async () => {
    const allUsers = await db.select().from(users);

    return {
      success: true,
      data: allUsers,
    };
  }),
  pages: adminProcedure.query(async () => {
    const allPages = await db.select().from(pages);

    return {
      success: true,
      data: allPages,
    };
  }),
  affiliates: adminProcedure.query(async () => {
    const tot_affiliates = await db.select().from(affiliates);

    return {
      success: true,
      data: tot_affiliates,
    };
  }),
  updateUser: adminProcedure
    .input(updateUserSchema.extend({ prevPlan: z.enum(plansList).nullish() }))
    .mutation(async (opts) => {
      const { id, status, plan, subscription_end_date, prevPlan } = opts.input;
      const planInfo =
        pricing_plans.find((p) => p.id === plan) || pricing_plans[0];

      const [updatedUser] = await db
        .update(users)
        .set({
          status,
          plan,
          subscription_end_date,
        })
        .where(eq(users.id, id))
        .returning();

      if (prevPlan && prevPlan == "free" && plan !== "free") {
        await db.update(affiliates).set({
          converstions: sql`${affiliates.converstions} + 1`,
          total_payouts: sql`${affiliates.total_payouts} + ${Number(
            (
              (!!subscription_end_date
                ? planInfo.price.year
                : planInfo.price.onetime) * AFFILIATE_FEE
            ).toFixed(1)
          )}`,
        });
      }
      return {
        success: true,
        message: "User updated successfully!",
        data: updatedUser,
      };
    }),
  check: adminProcedure.query(() => {
    return {
      success: true,
      message: "Admin route is working!",
    };
  }),
});
