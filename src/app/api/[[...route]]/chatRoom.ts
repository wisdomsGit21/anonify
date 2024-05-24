import { Hono } from "hono";
import { z } from "zod";
import { zValidator } from "@hono/zod-validator";
import db from "@/db";
import { InsertChatRoomSchema } from "@/db/schema/chatRooms";
import { chatRoom } from "@/db/schema";
import users from "@/db/schema/users";
import { eq } from "drizzle-orm";
import messages from "@/db/schema/messages";
// import { WebSocketServer } from "ws";

const paramSchema = z.object({
  chatRoomId: z.string(),
});

const contentSchema = z.object({
  content: z.string(),
});

const userSchame = z.object({
  id: z.string(),
});

// const wss = new WebSocketServer({ noServer: true });

// wss.on("connection", (ws, request) => {
//   ws.on("message", async (message) => {
//     const data = JSON.parse(message.toString());
//     const { chatRoomId, content } = data;

//     const validChatRoom = await db.query.chatRoom.findFirst({
//       columns: { id: true },
//       where: eq(chatRoom.id, Number(chatRoomId)),
//     });

//     if (validChatRoom) {
//       const newMessage = await db
//         .insert(messages)
//         .values({
//           chatRoomId: Number(validChatRoom.id),
//           content,
//         })
//         .returning();

//       // Broadcast the new message to all connected clients
//       wss.clients.forEach((client) => {
//         if (client.readyState === ws.OPEN) {
//           client.send(JSON.stringify(newMessage[0]));
//         }
//       });
//     }
//   });
// });

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
      // columns: {
      //   id: true,
      // },
      where: eq(chatRoom.id, Number(chatRoomId)),
    });
    if (!validChatRoom?.id) {
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
  )
  .get("/user/:id", zValidator("param", userSchame), async (c) => {
    const { id } = c.req.valid("param");
    const chatRoom = await db.query.chatRoom.findFirst({
      where: eq(messages.id, Number(id)),
    });
    if (!chatRoom) {
      return c.json({ message: "chat not found" }, 404);
    }

    const user = await db.query.user.findFirst({
      where: eq(users.id, chatRoom.ownerId),
    });
    return c.json(user);
  });
export default app;
