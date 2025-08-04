import { pageRouter } from "@/modules/pages/router";
import { createTRPCRouter } from "../init";

export const appRouter = createTRPCRouter({
  pages: pageRouter,
});

export type AppRouter = typeof appRouter;
