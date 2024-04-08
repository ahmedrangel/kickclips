import { createServer } from "node:http";
import { createServerAdapter } from "@whatwg-node/server";
import { IttyRouter, error } from "itty-router";
import { Kient } from "@ahmedrangel/kient";
import * as dotenv from "dotenv";
import JsResponse from "./JsResponse.js";
import { format } from "date-fns";
import OTP from "otp";

dotenv.config();

const router = IttyRouter();

// Create a new client instance
const client = await Kient.create();

const token = new OTP({
  secret: process.env["2FA"],
}).totp(Date.now());

console.info(token);

// Get a channel and listen to its chatroom
await client.api.authentication.login({
  email: process.env.EMAIL, // mail@example.com
  password: process.env.PASSWORD, // qwerty123
  otc: token, // one-time code provided via TOTP or Email
});

console.info("Logged in");

const getClip = async (id) => {
  return await client.api.clip.downloadClip(id);
};

router.get("/api/kick/clip/:id", async (req) => {
  const id = req.params.id;
  const now = new Date();
  const date = format(now, "yyyy-MM-dd hh:mm:ss");
  console.info(`${date}: ${id}`);
  try {
    const clip = await getClip(id);
    return new JsResponse(clip);
  } catch (e) {
    return new JsResponse({ error: e.message, status: 404 });
  }
});

router.all("*", () => new JsResponse("Not Found", { status: 404 }));

const ittyServer = createServerAdapter(
  (request, env, ctx) => router
    .fetch(request, env, ctx)
    .catch(error),
);

const httpServer = createServer(ittyServer);
httpServer.listen(process.env.PORT);
