import crypto from "node:crypto";
import { config } from "../config.js";

const AUTH_URL = "https://www.linkedin.com/oauth/v2/authorization";
const TOKEN_URL = "https://www.linkedin.com/oauth/v2/accessToken";

export function buildLinkedInAuthUrl() {
  const state = crypto.randomBytes(24).toString("hex");
  const url = new URL(AUTH_URL);

  url.searchParams.set("response_type", "code");
  url.searchParams.set("client_id", config.LINKEDIN_CLIENT_ID);
  url.searchParams.set("redirect_uri", config.LINKEDIN_REDIRECT_URI);
  url.searchParams.set("scope", config.LINKEDIN_SCOPES);
  url.searchParams.set("state", state);

  return { url: url.toString(), state };
}

export async function exchangeCodeForToken(code: string) {
  const body = new URLSearchParams();
  body.set("grant_type", "authorization_code");
  body.set("code", code);
  body.set("redirect_uri", config.LINKEDIN_REDIRECT_URI);
  body.set("client_id", config.LINKEDIN_CLIENT_ID);
  body.set("client_secret", config.LINKEDIN_CLIENT_SECRET);

  const res = await fetch(TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`LinkedIn token exchange failed: ${res.status} ${text}`);
  }

  return res.json() as Promise<{
    access_token: string;
    expires_in: number;
    refresh_token?: string;
    refresh_token_expires_in?: number;
    scope?: string;
    id_token?: string;
  }>;
}
