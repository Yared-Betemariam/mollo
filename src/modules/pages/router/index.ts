import { db } from "@/db";
import { pages } from "@/db/schema";
import { usernameSchema } from "@/schemas";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { eq } from "drizzle-orm";
import z from "zod";
import { PageNodeSchema } from "../editor";

export const pageRouter = createTRPCRouter({
  // create: protectedProcedure.input(accountSchema).mutation(async (opts) => {
  //   const [newAccount] = await db
  //     .insert(accounts)
  //     .values({ ...opts.input, user_id: Number(opts.ctx.session.user.id) })
  //     .returning();

  //   return {
  //     success: true,
  //     message: "Account successfully created!",
  //     data: newAccount,
  //   };
  // }),
  user: protectedProcedure.query(async (opts) => {
    const user_page = await db
      .select()
      .from(pages)
      .where(eq(pages.user_id, Number(opts.ctx.session.user.id)));

    if (user_page.length < 1 || !user_page[0]) {
      return {
        success: false,
        message: "Page not found!",
        data: null,
      };
    }

    return {
      success: true,
      message: "Page successfully fetched!",
      data: user_page[0],
    };
  }),
  updateDefinition: protectedProcedure
    .input(
      z.object({
        id: z.number(),
        nodes: z.array(PageNodeSchema),
      })
    )
    .mutation(async (opts) => {
      await db
        .update(pages)
        .set({
          definition: { nodes: opts.input.nodes },
        })
        .where(eq(pages.id, Number(opts.input.id)));

      return {
        success: true,
        message: "Page successfully updated!",
      };
    }),
  checkUsernameStatus: protectedProcedure
    .input(
      z.object({
        username: usernameSchema,
      })
    )
    .query(async (otps) => {
      const isTaken = await db
        .select({ exists: pages.id })
        .from(pages)
        .where(eq(pages.username, otps.input.username))
        .limit(1);

      return {
        taken: isTaken.length > 0,
      };
    }),
  // delete: protectedProcedure
  //   .input(z.object({ id: z.number() }))
  //   .mutation(async (opts) => {
  //     await db.delete(accounts).where(eq(accounts.id, opts.input.id));

  //     return {
  //       success: true,
  //       message: "Account successfully deleted!",
  //     };
  //   }),
  // edit: protectedProcedure
  //   .input(accountSchema.extend({ id: z.number() }))
  //   .mutation(async (opts) => {
  //     const [updatedAccount] = await db
  //       .update(accounts)
  //       .set({ ...opts.input })
  //       .where(eq(accounts.id, opts.input.id))
  //       .returning();

  //     return {
  //       success: true,
  //       message: "Account successfully updated!",
  //       data: updatedAccount,
  //     };
  //   }),
});
