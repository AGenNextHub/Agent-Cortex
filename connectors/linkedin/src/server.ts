import Fastify from "fastify";
import cookie from "@fastify/cookie";
import formbody from "@fastify/formbody";
import { config } from "./config.js";
import { authRoutes } from "./routes/auth.js";
import { profileRoutes } from "./routes/profile.js";

const app = Fastify({ logger: true });

await app.register(cookie);
await app.register(formbody);

app.get("/healthz", async () => ({ ok: true, connector: config.AGX_CONNECTOR_ID }));
app.get("/readyz", async () => ({ ok: true, connector: config.AGX_CONNECTOR_ID }));

await app.register(authRoutes);
await app.register(profileRoutes);

await app.listen({ port: config.PORT, host: "0.0.0.0" });
