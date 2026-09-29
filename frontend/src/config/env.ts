import { z } from "zod";

// Validate the (build-time) environment so a missing var fails loudly.
const envSchema = z.object({
  VITE_API_URL: z.string().default("http://localhost:4000"),
});

export const env = envSchema.parse(import.meta.env);
