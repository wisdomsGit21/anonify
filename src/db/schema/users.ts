import { text, sqliteTable, integer } from "drizzle-orm/sqlite-core";
import { createInsertSchema } from "drizzle-zod";

const users = sqliteTable("users", {
  id: integer("id").primaryKey().notNull(),
  username: text("username").notNull().unique(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;
export const insertUserSchema = createInsertSchema(users);
export default users;
