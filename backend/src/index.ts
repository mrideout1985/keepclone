import { buildApp } from "./app.js";
import { config } from "./config/index.js";
import { pool } from "./db/index.js";
import { logger } from "./libraries/logger.js";

const app = buildApp();

const server = app.listen(config.PORT, () => {
  logger.info(`Backend listening on http://localhost:${config.PORT}`);
});

// Programmer errors: log and crash so the orchestrator restarts a clean process.
process.on("uncaughtException", (err) => {
  logger.fatal({ err }, "Uncaught exception");
  process.exit(1);
});
process.on("unhandledRejection", (reason) => {
  logger.fatal({ err: reason }, "Unhandled rejection");
  process.exit(1);
});

async function shutdown(signal: string): Promise<void> {
  logger.info(`${signal} received, shutting down`);
  server.close(async () => {
    await pool.end();
    process.exit(0);
  });
}
process.on("SIGTERM", () => void shutdown("SIGTERM"));
process.on("SIGINT", () => void shutdown("SIGINT"));
