import type { Response } from "express";
import { config } from "../../config/index.js";

export const SESSION_COOKIE = "keepclone_session";

const baseOptions = {
  httpOnly: true,
  sameSite: "lax" as const,
  secure: config.cookieSecure,
  domain: config.COOKIE_DOMAIN,
  path: "/",
};

export function setSessionCookie(res: Response, token: string): void {
  res.cookie(SESSION_COOKIE, token, {
    ...baseOptions,
    maxAge: config.SESSION_TTL_DAYS * 24 * 60 * 60 * 1000,
  });
}

export function clearSessionCookie(res: Response): void {
  res.clearCookie(SESSION_COOKIE, baseOptions);
}
