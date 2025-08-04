import { sql } from "drizzle-orm";
import {
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
      .references(() => users.id),
    username: varchar("username", { length: 255 }).notNull(),
    definition: json("definition").notNull(),
    base_template: varchar("base_template", { length: 255 }).notNull(),
    updated_at: timestamp("updated_at")
      .defaultNow()
      .notNull()
      .$onUpdate(() => sql`now()`),
  },
  (pages) => [index("pages_user_id_idx").on(pages.user_id)]
);

export type User = typeof users.$inferSelect;
export type Page = typeof pages.$inferSelect;
