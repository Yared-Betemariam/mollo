import { pageRouter } from "@/modules/pages/router";
import { createTRPCRouter } from "../init";
import { userRouter } from "@/modules/auth/router";
import { uploadsRouter } from "@/modules/uploads/router";

export const appRouter = createTRPCRouter({
  pages: pageRouter,
  users: userRouter,
  uploads: uploadsRouter,
});

export type AppRouter = typeof appRouter;
