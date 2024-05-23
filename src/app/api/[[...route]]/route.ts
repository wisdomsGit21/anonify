import { Hono } from "hono";
import { handle } from "hono/vercel";
// import messages from "./messages";
import auth from "./auth";
import chatRoom from "./chatRoom";
const app = new Hono().basePath("/api");

const routes = app.route("/auth", auth).route("/chatRoom", chatRoom);

export const GET = handle(app);
export const POST = handle(app);
export type AppType = typeof routes;
