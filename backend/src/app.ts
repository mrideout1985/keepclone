import cors from "cors";
import express, { type Express, type Request, type Response } from "express";
import helmet from "helmet";
import { pinoHttp } from "pino-http";
import { config } from "./config/index.js";
import { errorHandler, notFoundHandler } from "./libraries/error-handling.js";
import { logger } from "./libraries/logger.js";
import {
  getCorrelationId,
  requestContext,
} from "./libraries/request-context.js";

/**
 * Builds the Express app without starting a listener, so integration tests
 * can drive it with Supertest.
 *
 * Register feature routers below, e.g.:
 *   app.use("/api/<feature>", <feature>Router);
 */
export function buildApp(): Express {
  const app = express();

  app.use(helmet());
  app.use(cors({ origin: config.corsOrigins }));
  app.use(express.json());
  app.use(requestContext);
  app.use(
    pinoHttp({
      logger,
      customProps: () => ({ correlationId: getCorrelationId() }),
    }),
  );

  app.get("/health", (_req: Request, res: Response) => {
    res.json({ status: "ok" });
  });

  // Feature routers go here.

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
