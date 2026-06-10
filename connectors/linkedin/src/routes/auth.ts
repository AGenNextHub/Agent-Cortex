import type { FastifyInstance } from "fastify";
import { buildLinkedInAuthUrl, exchangeCodeForToken } from "../linkedin/oauth.js";
import { getLinkedInUserInfo } from "../linkedin/profile.js";

export async function authRoutes(app: FastifyInstance) {
  app.get("/auth/linkedin", async (_req, reply) => {
    const { url, state } = buildLinkedInAuthUrl();

    reply.setCookie("linkedin_oauth_state", state, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/"
    });

    return reply.redirect(url);
  });

  app.get("/auth/linkedin/callback", async (req, reply) => {
    const query = req.query as {
      code?: string;
      state?: string;
      error?: string;
      error_description?: string;
    };

    const cookieState = req.cookies.linkedin_oauth_state;

    if (query.error) {
      return reply.code(400).send(query);
    }

    if (!query.code || !query.state || query.state !== cookieState) {
      return reply.code(400).send({ error: "invalid_oauth_state" });
    }

    const token = await exchangeCodeForToken(query.code);
    const profile = await getLinkedInUserInfo(token.access_token);

    return reply.send({
      ok: true,
      token: {
        expires_in: token.expires_in,
        scope: token.scope
      },
      profile
    });
  });
}
