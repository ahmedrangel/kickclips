import { createServer } from "node:http";
import { createServerAdapter } from "@whatwg-node/server";
import { AutoRouter, error, cors } from "itty-router";
import { Kient } from "kient";
import "dotenv/config";
import { format } from "date-fns";
import OTP from "otp";

const { preflight, corsify } = cors();
const router = AutoRouter({
  before: [preflight],
  catch: error,
  finally: [corsify]
});

// Create a new client instance
const client = await Kient.create();
const token = new OTP({ secret: process.env["2FA"] }).totp(Date.now());
console.info(token);

// Authentication
await client.api.authentication.login({
  email: process.env.EMAIL, // mail@example.com
  password: process.env.PASSWORD, // qwerty123
  otc: token // one-time code provided via TOTP or Email
});

console.info("Logged in");

router.get("/api/kick/clip/:id/download", async (req) => {
  const id = req.params.id;
  const now = new Date();
  const date = format(now, "yyyy-MM-dd hh:mm:ss");
  console.info(`[download] ${date}: ${id}`);
  try {
    const clip = await client.api.clip.downloadClip(id);
    return clip;
  }
  catch (e) {
    console.log(e)
    return { error: e.message, status: 404 };
  }
});

router.get("/api/kick/clip/:id", async (req) => {
  const id = req.params.id;
  const now = new Date();
  const date = format(now, "yyyy-MM-dd hh:mm:ss");
  console.info(`[details] ${date}: ${id}`);
  try {
    const clip = await client.api.clip.getClip(id);
    return clip;
  }
  catch (e) {
    console.log(e)
    return { error: e.message, status: 404 };
  }
});

router.all("*", () =>
  Response.json({ success: false, error: "Route not found" }, { status: 404 })
);

const ittyServer = createServerAdapter((request, env, ctx) => router.fetch(request, env, ctx));
const httpServer = createServer(ittyServer);
httpServer.listen(process.env.PORT);
