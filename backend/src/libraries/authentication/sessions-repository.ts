import { and, eq, gt, lt } from "drizzle-orm";
import { db } from "../../db/index.js";
import { sessions, users } from "../../db/schema.js";

export type SessionUser = {
  id: string;
  name: string;
  email: string;
};

export async function insertSession(session: {
  userId: string;
  tokenHash: string;
  expiresAt: Date;
}): Promise<void> {
  await db.insert(sessions).values(session);
}

export async function findUserBySessionTokenHash(
  tokenHash: string,
): Promise<SessionUser | undefined> {
  const rows = await db
    .select({ id: users.id, name: users.name, email: users.email })
    .from(sessions)
    .innerJoin(users, eq(sessions.userId, users.id))
    .where(
      and(
        eq(sessions.tokenHash, tokenHash),
        gt(sessions.expiresAt, new Date()),
      ),
    )
    .limit(1);
  return rows[0];
}

export async function deleteSessionByTokenHash(
  tokenHash: string,
): Promise<void> {
  await db.delete(sessions).where(eq(sessions.tokenHash, tokenHash));
}

export async function deleteExpiredSessions(): Promise<void> {
  await db.delete(sessions).where(lt(sessions.expiresAt, new Date()));
}
