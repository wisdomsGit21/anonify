import { drizzle } from "drizzle-orm/libsql";
import { createClient } from "@libsql/client";
import env from "../../env";
import * as schema from "@/db/schema";

const client = createClient({
  url: env.DATABASE_URL,
  authToken: env.DB_AUTH_TOKEN,
});

export const db = drizzle(client, {
  schema,
  logger: true,
});

export type db = typeof db;

export default db;
