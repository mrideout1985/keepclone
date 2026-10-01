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
