import { sql } from "drizzle-orm";
import { text, sqliteTable, integer } from "drizzle-orm/sqlite-core";
import chatRooms from "./chatRooms";

const messages = sqliteTable("messages", {
  id: integer("id").primaryKey().notNull(),
  chatRoomId: integer("chatRoomId")
    .notNull()
    .references(() => chatRooms.id),
  content: text("content").notNull(),
  createdAt: integer("createdAt", { mode: "timestamp" }).default(
    sql`CURRENT_TIMESTAMP`
  ),
});

export type Message = typeof messages.$inferSelect;
export type InsertMessage = typeof messages.$inferInsert;

export default messages;
