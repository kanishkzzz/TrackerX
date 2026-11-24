import "server-only";

import { neon } from "@neondatabase/serverless";
import { drizzle as drizzleNeon } from "drizzle-orm/neon-http";
import { drizzle as drizzlePostgres } from "drizzle-orm/node-postgres";
import type { NodePgDatabase } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

function createDatabase(): NodePgDatabase {
  if (process.env.DATABASE_PROVIDER === "local") {
    const connectionString = process.env.LOCAL_DATABASE_URL;
    if (!connectionString) {
      throw new Error("LOCAL_DATABASE_URL is required when DATABASE_PROVIDER=local.");
    }

    const pool = new Pool({ connectionString });
    return drizzlePostgres({ client: pool });
  }

  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error("DATABASE_URL is not configured.");
  }

  return drizzleNeon({ client: neon(connectionString) }) as unknown as NodePgDatabase;
}

let database: NodePgDatabase | undefined;

/** Lazily create the configured Postgres client on the server. */
export function getDb() {
  return (database ??= createDatabase());
}
