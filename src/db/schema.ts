import { index, jsonb, pgTable, text, timestamp, varchar } from "drizzle-orm/pg-core"

export const bins = pgTable("bins", {
  id: varchar("id", { length: 12 }).primaryKey(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
})

export const requests = pgTable(
  "requests",
  {
    id: varchar("id", { length: 21 }).primaryKey(),
    binId: varchar("bin_id", { length: 12 })
      .notNull()
      .references(() => bins.id, { onDelete: "cascade" }),
    method: varchar("method", { length: 10 }).notNull(),
    path: text("path").notNull(),
    query: jsonb("query").$type<Record<string, string | string[]>>().notNull().default({}),
    headers: jsonb("headers").$type<Record<string, string>>().notNull().default({}),
    body: text("body"),
    contentType: text("content_type"),
    ip: text("ip"),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [index("requests_bin_id_created_at_idx").on(table.binId, table.createdAt)],
)

export type Bin = typeof bins.$inferSelect
export type Request = typeof requests.$inferSelect
