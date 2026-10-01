import pino from "pino";
import { config } from "../config/index.js";
import { getCorrelationId } from "./request-context.js";

export const logger = pino({
  level: config.isTest ? "silent" : config.LOG_LEVEL,
  mixin() {
    const correlationId = getCorrelationId();
    return correlationId ? { correlationId } : {};
  },
  transport:
    config.isProduction || config.isTest
      ? undefined
      : { target: "pino-pretty", options: { colorize: true } },
});
