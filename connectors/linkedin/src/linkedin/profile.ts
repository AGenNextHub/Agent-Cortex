import { linkedInGet } from "./client.js";

export type LinkedInUserInfo = {
  sub: string;
  name?: string;
  given_name?: string;
  family_name?: string;
  picture?: string;
  email?: string;
  email_verified?: boolean;
  locale?: string;
};

export async function getLinkedInUserInfo(accessToken: string) {
  return linkedInGet<LinkedInUserInfo>("https://api.linkedin.com/v2/userinfo", accessToken);
}
