import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",
    include: ["test/**/*.test.ts", "src/**/*.test.ts"],
    globals: true,
    // Integration tests that hit a real database should run serially and
    // migrate/reset state in a setup file. Re-enable when you add them:
    // fileParallelism: false,
    // setupFiles: ["./test/setup.ts"],
  },
});
