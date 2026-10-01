import cookieParser from "cookie-parser";
import cors from "cors";
import express, { type Express, type Request, type Response } from "express";
import helmet from "helmet";
import { pinoHttp } from "pino-http";
import { authRouter } from "./components/user/entry-points/user-routes.js";
import { config } from "./config/index.js";
import { errorHandler, notFoundHandler } from "./libraries/error-handling.js";
import { logger } from "./libraries/logger.js";
import {
  getCorrelationId,
  requestContext,
} from "./libraries/request-context.js";

export function buildApp(): Express {
  const app = express();

  app.use(helmet());
  app.use(cors({ origin: config.corsOrigins, credentials: true }));
  app.use(express.json());
  app.use(cookieParser());
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

  app.use("/api/auth", authRouter);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
