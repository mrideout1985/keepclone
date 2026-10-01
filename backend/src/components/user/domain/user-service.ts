import bcrypt from "bcryptjs";
import { createSession } from "../../../libraries/authentication/session-service.js";
import { AppError } from "../../../libraries/error-handling.js";
import {
  findUserByEmail,
  insertUser,
} from "../data-access/users-repository.js";

const BCRYPT_ROUNDS = 12;

export type PublicUser = { id: string; name: string; email: string };
export type AuthResult = { user: PublicUser; token: string };

const normaliseEmail = (email: string): string => email.trim().toLowerCase();

export async function register(input: {
  name: string;
  email: string;
  password: string;
}): Promise<AuthResult> {
  const email = normaliseEmail(input.email);
  const existing = await findUserByEmail(email);
  if (existing) {
    throw new AppError("An account with that email already exists", 409);
  }
  const passwordHash = await bcrypt.hash(input.password, BCRYPT_ROUNDS);
  const user = await insertUser({
    name: input.name.trim(),
    email,
    passwordHash,
  });
  const token = await createSession(user.id);
  return { user: { id: user.id, name: user.name, email: user.email }, token };
}

export async function login(input: {
  email: string;
  password: string;
}): Promise<AuthResult> {
  const email = normaliseEmail(input.email);
  const user = await findUserByEmail(email);
  if (!user) {
    throw new AppError("No account found for that email", 401);
  }
  const ok = await bcrypt.compare(input.password, user.passwordHash);
  if (!ok) {
    throw new AppError("Incorrect password. Try again.", 401);
  }
  const token = await createSession(user.id);
  return { user: { id: user.id, name: user.name, email: user.email }, token };
}
