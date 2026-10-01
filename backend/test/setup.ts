import { sql } from "drizzle-orm";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import { afterAll, beforeAll, beforeEach } from "vitest";
import { db, pool } from "../src/db/index.js";

beforeAll(async () => {
  await migrate(db, { migrationsFolder: "./drizzle" });
});

beforeEach(async () => {
  const { rows } = await pool.query<{ tablename: string }>(
    `SELECT tablename FROM pg_tables
       WHERE schemaname = 'public' AND tablename <> '__drizzle_migrations'`,
  );
  if (rows.length === 0) return;
  const list = rows.map((r) => `"${r.tablename}"`).join(", ");
  await db.execute(sql.raw(`TRUNCATE TABLE ${list} RESTART IDENTITY CASCADE;`));
});

afterAll(async () => {
  await pool.end();
});
