import type { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";
import { logger } from "./logger.js";
import { getCorrelationId } from "./request-context.js";

/**
 * Application error. `isOperational` marks expected failures (bad input, not
 * found) as opposed to programmer errors / bugs, which should crash.
 */
export class AppError extends Error {
  readonly httpStatus: number;
  readonly isOperational: boolean;

  constructor(message: string, httpStatus = 500, isOperational = true) {
    super(message);
    this.name = this.constructor.name;
    this.httpStatus = httpStatus;
    this.isOperational = isOperational;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class NotFoundError extends AppError {
  constructor(message = "Resource not found") {
    super(message, 404, true);
  }
}

export class ValidationError extends AppError {
  readonly details: unknown;
  constructor(message: string, details: unknown) {
    super(message, 400, true);
    this.details = details;
  }
}

/** 404 handler for unmatched routes. */
export function notFoundHandler(
  req: Request,
  _res: Response,
  next: NextFunction,
): void {
  next(new NotFoundError(`Route not found: ${req.method} ${req.originalUrl}`));
}

/**
 * Centralized error handler — the single place that turns an error into an
 * HTTP response. Controllers should throw, not shape responses themselves.
 */
export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars -- Express needs 4 args to treat this as an error handler.
  _next: NextFunction,
): void {
  const correlationId = getCorrelationId();

  if (err instanceof ZodError) {
    logger.warn({ err }, "Request validation failed");
    res.status(400).json({
      error: {
        message: "Validation failed",
        details: err.issues,
        correlationId,
      },
    });
    return;
  }

  if (err instanceof AppError) {
    const detail = err instanceof ValidationError ? err.details : undefined;
    if (err.isOperational) {
      logger.warn({ err }, err.message);
    } else {
      logger.error({ err }, err.message);
    }
    res.status(err.httpStatus).json({
      error: { message: err.message, details: detail, correlationId },
    });
    return;
  }

  // Unknown / programmer error — log loudly, leak nothing.
  logger.error({ err }, "Unhandled error");
  res.status(500).json({
    error: { message: "Internal server error", correlationId },
  });
}
