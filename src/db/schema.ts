import { generateId } from "@/lib/utils";
import { PageNode } from "@/modules/pages/editor";
import { plansList, statusList } from "@/types";
import {
  boolean,
  index,
  integer,
  json,
  pgTable,
  serial,
  numeric,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";

export const affiliates = pgTable("affiliates", {
  id: varchar("id", { length: 12 })
    .primaryKey()
    .notNull()
    .$defaultFn(() => generateId(true)),
  user_id: integer("user_id")
    .notNull()
    .unique()
    .references(() => users.id),
  created_at: timestamp("created_at").defaultNow().notNull(),

  converstions: integer("converstions").default(0).notNull(),
  total_payouts: numeric("total_payouts").default("0").notNull(),
  payouts: numeric("payouts").default("0").notNull(),
});

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  status: text("status", {
    enum: statusList,
  })
    .default("active")
    .notNull(),
  plan: varchar("plan", {
    enum: plansList,
  })
    .default("free")
    .notNull(),
  subscription_end_date: timestamp("subscription_end_date"),
  rId: varchar("r_id", { length: 12 }),
  created_at: timestamp("created_at").defaultNow().notNull(),
});

export const pages = pgTable(
  "pages",
  {
    id: serial("id").primaryKey(),
    user_id: integer("user_id")
      .notNull()
      .unique()
      .references(() => users.id),
    username: varchar("username", { length: 255 }).unique().notNull(),
    definition: json("definition")
      .$type<{ template: string; nodes: PageNode[] }>()
      .notNull(),

    published: boolean("published").default(false).notNull(),
    published_date: timestamp("published_date", { withTimezone: true }),

    updated_at: timestamp("updated_at")
      .defaultNow()
      .notNull()
      .$onUpdate(() => new Date()),
  },
  (pages) => [index("pages_username_idx").on(pages.username)]
);

export type User = typeof users.$inferSelect;
export type Affiliate = typeof users.$inferSelect;
export type Page = typeof pages.$inferSelect;
