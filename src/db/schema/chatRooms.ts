import { text, sqliteTable, integer } from "drizzle-orm/sqlite-core";
import users from "./users";
import { createInsertSchema } from "drizzle-zod";

const chatRooms = sqliteTable("chatRooms", {
  id: integer("id").primaryKey().notNull(),
  ownerId: integer("ownerId")
    .notNull()
    .references(() => users.id),
});

export type ChatRoom = typeof chatRooms.$inferSelect;
export type InsertChatRoom = typeof chatRooms.$inferInsert;
export const InsertChatRoomSchema = createInsertSchema(chatRooms);
export default chatRooms;
