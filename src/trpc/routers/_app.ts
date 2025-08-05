import { pageRouter } from "@/modules/pages/router";
import { createTRPCRouter } from "../init";
import { userRouter } from "@/modules/auth/router";

export const appRouter = createTRPCRouter({
  pages: pageRouter,
  users: userRouter,
});

export type AppRouter = typeof appRouter;
