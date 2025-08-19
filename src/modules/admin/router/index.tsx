import { db } from "@/db";
import { pages, users } from "@/db/schema";
import { updateUserSchema } from "@/schemas";
import { adminProcedure, createTRPCRouter } from "@/trpc/init";
import { eq } from "drizzle-orm";

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
  updateUser: adminProcedure.input(updateUserSchema).mutation(async (opts) => {
    const { id, status, plan, subscription_end_date } = opts.input;

    const [updatedUser] = await db
      .update(users)
      .set({
        status,
        plan,
        subscription_end_date,
      })
      .where(eq(users.id, id))
      .returning();

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
