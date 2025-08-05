import { PageNode } from "@/modules/pages/editor";
import { sql } from "drizzle-orm";
import {
  boolean,
  index,
  integer,
  json,
  pgTable,
  serial,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  email: varchar("email", { length: 255 }).notNull().unique(),
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
    definition: json("definition").$type<{ nodes: PageNode[] }>().notNull(),
    base_template: varchar("base_template", { length: 255 }).notNull(),

    published: boolean("published").default(false).notNull(),
    published_date: timestamp("published_date", { withTimezone: true }),

    updated_at: timestamp("updated_at")
      .defaultNow()
      .notNull()
      .$onUpdate(() => sql`now()`),
  },
  (pages) => [index("pages_username_idx").on(pages.username)]
);

export type User = typeof users.$inferSelect;
export type Page = typeof pages.$inferSelect;
