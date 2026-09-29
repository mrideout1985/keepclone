import pino from "pino";
import { config } from "../config/index.js";
import { getCorrelationId } from "./request-context.js";

export const logger = pino({
  level: config.isTest ? "silent" : config.LOG_LEVEL,
  // Attach the current request's correlation id to every log line.
  mixin() {
    const correlationId = getCorrelationId();
    return correlationId ? { correlationId } : {};
  },
  // Pretty output in local dev only; JSON in prod, and no transport worker
  // under tests (it doesn't play well with the test runner).
  transport:
    config.isProduction || config.isTest
      ? undefined
      : { target: "pino-pretty", options: { colorize: true } },
});
