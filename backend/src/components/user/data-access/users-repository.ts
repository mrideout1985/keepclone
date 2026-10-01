import { eq } from "drizzle-orm";
import { db } from "../../../db/index.js";
import { type NewUser, type User, users } from "../../../db/schema.js";

export async function findUserByEmail(
  email: string,
): Promise<User | undefined> {
  const rows = await db
    .select()
    .from(users)
    .where(eq(users.email, email))
    .limit(1);
  return rows[0];
}

export async function insertUser(user: NewUser): Promise<User> {
  const [row] = await db.insert(users).values(user).returning();
  return row!;
}
