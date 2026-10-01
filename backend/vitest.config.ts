import dotenv from "dotenv";
import { defineConfig } from "vitest/config";

// Load the test database settings and hand them to the test runtime. `config`
// (loaded via app code) reads these because dotenv won't override an env var
// that's already set.
const testEnv = dotenv.config({ path: ".env.test" }).parsed ?? {};

export default defineConfig({
  test: {
    environment: "node",
    include: ["test/**/*.test.ts", "src/**/*.test.ts"],
    globals: true,
    env: { NODE_ENV: "test", ...testEnv },
    // Integration tests share one database, so run files serially and reset
    // state between tests in the setup file.
    fileParallelism: false,
    setupFiles: ["./test/setup.ts"],
  },
});
