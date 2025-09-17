import { db } from "@/db";
import { affiliates, users } from "@/db/schema";
import {
  adminProcedure,
  createTRPCRouter,
  protectedProcedure,
} from "@/trpc/init";
import { AffiliateData } from "@/types";
import { TRPCError } from "@trpc/server";
import { eq } from "drizzle-orm";
import z from "zod";

export const affiliateRouter = createTRPCRouter({
  register: protectedProcedure.mutation(async (opts) => {
    const [affiliate] = await db
      .insert(affiliates)
      .values({ user_id: Number(opts.ctx.session.user.id) })
      .returning();

    return {
      success: true,
      data: affiliate,
    };
  }),
  user: protectedProcedure.query(async (opts) => {
    const [affiliate] = await db
      .select()
      .from(affiliates)
      .where(eq(affiliates.user_id, Number(opts.ctx.session.user.id)));

    if (!affiliate) {
      return {
        success: false,
      };
    }

    const a_users = await db
      .select({
        id: users.id,
      })
      .from(users)
      .where(eq(users.rId, affiliate.id));

    return {
      success: true,
      data: {
        id: affiliate.id,
        signups: a_users.length,
        conversions: affiliate.converstions,
        withdrawnPayouts: Number(affiliate.payouts),
        remainingPayouts:
          Number(affiliate.total_payouts) - Number(affiliate.payouts),
      } as AffiliateData,
    };
  }),
  payout: adminProcedure
    .input(
      z.object({
        total_payouts: z.string(),
      })
    )
    .mutation(async (opts) => {
      if (!Number(opts.input.total_payouts)) {
        throw new TRPCError({ code: "BAD_REQUEST" });
      }

      await db
        .update(affiliates)
        .set({
          payouts: opts.input.total_payouts,
        })
        .where(eq(affiliates.user_id, Number(opts.ctx.session.user.id)));

      return {
        success: true,
      };
    }),
});
