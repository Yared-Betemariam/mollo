import { db } from "@/db";
import { pages } from "@/db/schema";
import { updatePageSchema, usernameSchema } from "@/schemas";
import {
  baseProcedure,
  createTRPCRouter,
  protectedProcedure,
} from "@/trpc/init";
import { and, eq } from "drizzle-orm";
import z from "zod";
import { PageNodeSchema } from "../editor";
import { redis } from "@/redis";
import { RedisDefinitionData } from "@/types";

export const pageRouter = createTRPCRouter({
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
  data: baseProcedure.input(z.string()).query(async (opts) => {
    const data = await redis.get<RedisDefinitionData>(
      `definition:${opts.input}`
    );

    if (!data) {
      const page_datas = await db
        .select({ definition: pages.definition })
        .from(pages)
        .where(and(eq(pages.username, opts.input), eq(pages.published, true)));

      if (page_datas.length < 1 || !page_datas[0]) {
        return {
          success: false,
          message: "Page not found!",
          data: null,
        };
      }

      await redis.set(`definition:${opts.input}`, page_datas[0]);

      return {
        success: true,
        message: "Page successfully fetched!",
        data: page_datas[0],
      };
    }

    return {
      success: true,
      message: "Page successfully fetched!",
      data,
    };
  }),
  updateDefinition: protectedProcedure
    .input(
      z.object({
        id: z.number(),
        template: z.string(),
        username: z.string(),
        nodes: z.array(PageNodeSchema),
      })
    )
    .mutation(async (opts) => {
      await Promise.all([
        db
          .update(pages)
          .set({
            definition: {
              template: opts.input.template,
              nodes: opts.input.nodes,
            },
          })
          .where(eq(pages.id, Number(opts.input.id))),
        redis.del(`definition:${opts.input.username}`),
      ]);

      return {
        success: true,
        message: "Page successfully updated!",
        data: opts.input.nodes,
      };
    }),
  update: protectedProcedure
    .input(
      updatePageSchema.extend({
        id: z.number(),
      })
    )
    .mutation(async (opts) => {
      const { username, published, template, nodes } = opts.input;

      await db
        .update(pages)
        .set({
          username,
          published,
          ...(template && nodes
            ? {
                definition: {
                  template,
                  nodes,
                },
              }
            : {}),
          published_date: published ? new Date() : null,
        })
        .where(eq(pages.id, Number(opts.input.id)));

      if (published === false) {
        await redis.del(`definition:${opts.input.username}`);
      }

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
});
