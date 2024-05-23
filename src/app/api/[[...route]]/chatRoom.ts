import { Hono } from "hono";
import { z } from "zod";
import { zValidator } from "@hono/zod-validator";
import db from "@/db";
import { InsertChatRoomSchema } from "@/db/schema/chatRooms";
import { chatRoom } from "@/db/schema";
import users from "@/db/schema/users";
import { eq } from "drizzle-orm";
import messages from "@/db/schema/messages";

const paramSchema = z.object({
  chatRoomId: z.string(),
});

const contentSchema = z.object({
  content: z.string(),
});

const app = new Hono()
  .post(
    "/create",
    zValidator(
      "json",
      InsertChatRoomSchema.omit({
        id: true,
      })
    ),
    async (c) => {
      const { ownerId } = c.req.valid("json");
      const validOwner = await db.query.user.findFirst({
        columns: {
          id: true,
        },
        where: eq(users.id, ownerId),
      });
      if (validOwner) {
        const { id } = validOwner;
        const chatGroup = await db
          .insert(chatRoom)
          .values({ ownerId: id })
          .returning();
        return c.json({
          message: "chat group created",
          chatGroupId: chatGroup[0].id,
        });
      } else {
        return c.json({ message: "User not found" }, 404);
      }
    }
  )
  .get("/:chatRoomId", zValidator("param", paramSchema), async (c) => {
    const { chatRoomId } = c.req.valid("param");
    const validChatRoom = await db.query.chatRoom.findFirst({
      columns: {
        id: true,
      },
      where: eq(chatRoom.id, Number(chatRoomId)),
    });
    if (!validChatRoom) {
      return c.json({ message: "chat room messages not found" }, 404);
    }
    const msgs = await db.query.message.findMany({
      where: eq(messages.chatRoomId, validChatRoom.id),
    });
    return c.json(msgs);
  })
  .post(
    "/:chatRoomId/message",
    zValidator("param", paramSchema),
    zValidator("json", contentSchema),
    async (c) => {
      const { chatRoomId } = c.req.valid("param");
      const { content } = c.req.valid("json");
      const validChatRoom = await db.query.chatRoom.findFirst({
        columns: {
          id: true,
        },
        where: eq(chatRoom.id, Number(chatRoomId)),
      });
      if (!validChatRoom) {
        return c.json({ message: "chat room not found" }, 404);
      }
      const message = await db
        .insert(messages)
        .values({ chatRoomId: Number(validChatRoom.id), content })
        .returning();
      return c.json(message);
    }
  );

export default app;
