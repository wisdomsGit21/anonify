// import db from "@/db";
// import messages from "@/db/schema/messages";
// import { Hono } from "hono";

// const app = new Hono().get("/", async (c) => {
//   const data = await db
//     .select({
//       content: messages.content,
//       chatRoomId: messages.chatRoomId,
//     })
//     .from(messages);
//   return c.json({ data });
// });

// export default app;
