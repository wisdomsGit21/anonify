import { Hono } from "hono";
import * as bcrypt from "bcryptjs";
import { zValidator } from "@hono/zod-validator";
import users, { insertUserSchema } from "@/db/schema/users";
import db from "@/db";
import { eq } from "drizzle-orm";

const app = new Hono().post(
  "/register",
  zValidator(
    "json",
    insertUserSchema.omit({
      id: true,
    })
  ),
  async (c) => {
    const { username } = c.req.valid("json");
    const foundUser = await db.query.user.findFirst({
      where: eq(users.username, username),
    });
    if (foundUser) {
      return c.json(
        {
          message: "Username already exists",
        },
        409
      );
    }
    const user = await db.insert(users).values({ username }).returning();

    const stripedUser = user[0];
    return c.json({ message: "User registered", user: stripedUser });
  }
);

export default app;
