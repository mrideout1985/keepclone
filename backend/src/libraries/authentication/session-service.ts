import { createHash, randomBytes } from "node:crypto";
import { config } from "../../config/index.js";
import {
  deleteSessionByTokenHash,
  findUserBySessionTokenHash,
  insertSession,
  type SessionUser,
} from "./sessions-repository.js";

export type { SessionUser };

const hashToken = (token: string): string =>
  createHash("sha256").update(token).digest("hex");

export async function createSession(userId: string): Promise<string> {
  const token = randomBytes(32).toString("base64url");
  const expiresAt = new Date(
    Date.now() + config.SESSION_TTL_DAYS * 24 * 60 * 60 * 1000,
  );
  await insertSession({ userId, tokenHash: hashToken(token), expiresAt });
  return token;
}

export async function getUserBySessionToken(
  token: string | undefined,
): Promise<SessionUser | undefined> {
  if (!token) return undefined;
  return findUserBySessionTokenHash(hashToken(token));
}

export async function revokeSession(token: string | undefined): Promise<void> {
  if (!token) return;
  await deleteSessionByTokenHash(hashToken(token));
}
