import { resolve } from "node:path";
import dotenv from "dotenv";
import { z } from "zod";

dotenv.config({
  path: [resolve(process.cwd(), ".env"), resolve(process.cwd(), "../.env")],
  quiet: true,
});

const envSchema = z.object({
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),
  PORT: z.coerce.number().int().positive().default(4000),
  DATABASE_URL: z.string().min(1, "DATABASE_URL is required"),
  CORS_ORIGIN: z.string().default("http://localhost:3000"),
  LOG_LEVEL: z
    .enum(["fatal", "error", "warn", "info", "debug", "trace", "silent"])
    .default("info"),
  SESSION_TTL_DAYS: z.coerce.number().int().positive().default(30),
  COOKIE_SECURE: z
    .enum(["true", "false"])
    .optional()
    .transform((v) => v === "true"),
  COOKIE_DOMAIN: z.string().optional(),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  const issues = parsed.error.issues
    .map((i) => `  - ${i.path.join(".") || "(root)"}: ${i.message}`)
    .join("\n");
  console.error(`Invalid environment configuration:\n${issues}`);
  process.exit(1);
}

const isProduction = parsed.data.NODE_ENV === "production";

export const config = {
  ...parsed.data,
  corsOrigins: parsed.data.CORS_ORIGIN.split(",").map((o) => o.trim()),
  isProduction,
  isTest: parsed.data.NODE_ENV === "test",
  cookieSecure: parsed.data.COOKIE_SECURE ?? isProduction,
};

export type Config = typeof config;
