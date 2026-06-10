import { z } from "zod";

const EnvSchema = z.object({
  PORT: z.coerce.number().default(8787),
  PUBLIC_BASE_URL: z.string().url().default("http://localhost:8787"),
  LINKEDIN_CLIENT_ID: z.string().min(1),
  LINKEDIN_CLIENT_SECRET: z.string().min(1),
  LINKEDIN_REDIRECT_URI: z.string().url(),
  LINKEDIN_SCOPES: z.string().default("openid profile email"),
  AGX_CONNECTOR_ID: z.string().default("linkedin"),
  AGX_AUDIT_MODE: z.enum(["stdout"]).default("stdout")
});

export const config = EnvSchema.parse(process.env);
