import { Router } from "express";
import { z } from "zod";
import {
  SESSION_COOKIE,
  clearSessionCookie,
  setSessionCookie,
} from "../../../libraries/authentication/session-cookie.js";
import {
  getUserBySessionToken,
  revokeSession,
} from "../../../libraries/authentication/session-service.js";
import { AppError } from "../../../libraries/error-handling.js";
import { login, register } from "../domain/user-service.js";

const registerSchema = z.object({
  name: z.string().trim().min(1, "Enter your name"),
  email: z.string().trim().email("Enter a valid email address"),
  password: z.string().min(8, "Use 8 or more characters"),
});

const loginSchema = z.object({
  email: z.string().trim().email("Enter a valid email address"),
  password: z.string().min(1, "Enter your password"),
});

const forgotSchema = z.object({
  email: z.string().trim().email("Enter a valid email address"),
});

export const authRouter: Router = Router();

authRouter.post("/register", async (req, res) => {
  const input = registerSchema.parse(req.body);
  const { user, token } = await register(input);
  setSessionCookie(res, token);
  res.status(201).json({ user });
});

authRouter.post("/login", async (req, res) => {
  const input = loginSchema.parse(req.body);
  const { user, token } = await login(input);
  setSessionCookie(res, token);
  res.json({ user });
});

authRouter.post("/logout", async (req, res) => {
  const token = req.cookies?.[SESSION_COOKIE] as string | undefined;
  await revokeSession(token);
  clearSessionCookie(res);
  res.status(204).end();
});

authRouter.get("/me", async (req, res) => {
  const token = req.cookies?.[SESSION_COOKIE] as string | undefined;
  const user = await getUserBySessionToken(token);
  if (!user) {
    throw new AppError("Not authenticated", 401);
  }
  res.json({ user });
});

authRouter.post("/forgot-password", async (req, res) => {
  forgotSchema.parse(req.body);
  res.json({ ok: true });
});
