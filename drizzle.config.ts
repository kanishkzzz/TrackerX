import { config } from "dotenv";
import { fileURLToPath } from "node:url";
import { defineConfig } from "drizzle-kit";

config({ path: fileURLToPath(new URL("./.env.local", import.meta.url)) });

const migrationDatabaseUrl =
  process.env.LOCAL_DATABASE_URL ?? process.env.DATABASE_URL_UNPOOLED;
if (!migrationDatabaseUrl) {
  throw new Error(
    "Set LOCAL_DATABASE_URL for local migrations or DATABASE_URL_UNPOOLED for Neon migrations.",
  );
}

export default defineConfig({
  schema: "./app/src/db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: migrationDatabaseUrl,
  },
});
