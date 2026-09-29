import { AsyncLocalStorage } from "node:async_hooks";
import { randomUUID } from "node:crypto";
import type { NextFunction, Request, Response } from "express";

type RequestContext = {
  correlationId: string;
};

const storage = new AsyncLocalStorage<RequestContext>();

export function getCorrelationId(): string | undefined {
  return storage.getStore()?.correlationId;
}

/**
 * Assigns a correlation id per request and makes it available anywhere
 * downstream (logs, errors) without threading it through every function.
 */
export function requestContext(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  const correlationId =
    (req.headers["x-correlation-id"] as string | undefined) ?? randomUUID();
  res.setHeader("x-correlation-id", correlationId);
  storage.run({ correlationId }, () => next());
}
