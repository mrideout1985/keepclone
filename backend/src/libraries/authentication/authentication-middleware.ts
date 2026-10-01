import type { NextFunction, Request, Response } from "express";
import { AppError } from "../error-handling.js";
import { getUserBySessionToken } from "./session-service.js";
import { SESSION_COOKIE } from "./session-cookie.js";

export async function requireAuth(
  req: Request,
  _res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const token = req.cookies?.[SESSION_COOKIE] as string | undefined;
    const user = await getUserBySessionToken(token);
    if (!user) {
      throw new AppError("Not authenticated", 401);
    }
    req.userId = user.id;
    next();
  } catch (err) {
    next(err);
  }
}
