import { sql } from "drizzle-orm";
import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";

export async function GET() {
  try {
    await getDb().execute(sql`select 1`, "raw");
    return NextResponse.json({ status: "ok", database: "connected" });
  } catch (error) {
    const diagnostics =
      process.env.NODE_ENV === "production"
        ? undefined
        : {
            provider: process.env.DATABASE_PROVIDER ?? "unset",
            databaseUrlConfigured: Boolean(process.env.DATABASE_URL),
            localDatabaseUrlConfigured: Boolean(process.env.LOCAL_DATABASE_URL),
            errorType: error instanceof Error ? error.name : typeof error,
            errorCode:
              error && typeof error === "object" && "code" in error
                ? String(error.code)
                : undefined,
          };

    return NextResponse.json(
      { status: "error", database: "unavailable", ...(diagnostics && { diagnostics }) },
      { status: 503 },
    );
  }
}
