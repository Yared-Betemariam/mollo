import { pageRouter } from "@/modules/pages/router";
import { createTRPCRouter } from "../init";
import { userRouter } from "@/modules/auth/router";
import { uploadsRouter } from "@/modules/uploads/router";
import { adminRouter } from "@/modules/admin/router";
import { affiliateRouter } from "@/modules/affiliate/router";

export const appRouter = createTRPCRouter({
  pages: pageRouter,
  users: userRouter,
  uploads: uploadsRouter,
  admin: adminRouter,
  affiliate: affiliateRouter,
});

export type AppRouter = typeof appRouter;
