import { and, eq, gt } from "drizzle-orm";
import { getDb } from "@/lib/db";
import { sessionsTable } from "@/app/src/db/schema";
import type { NewSessionRecord, SessionRecord } from "./session.types";

export class SessionRepository {
  async create(input: NewSessionRecord): Promise<SessionRecord> {
    const [session] = await getDb()
      .insert(sessionsTable)
      .values(input)
      .returning();

    if (!session) {
      throw new Error("Could not create the session.");
    }

    return session;
  }

  async findActiveByTokenHash(
    tokenHash: string,
    now = new Date(),
  ): Promise<SessionRecord | null> {
    const [session] = await getDb()
      .select()
      .from(sessionsTable)
      .where(
        and(
          eq(sessionsTable.tokenHash, tokenHash),
          gt(sessionsTable.expiresAt, now),
        ),
      )
      .limit(1);

    return session ?? null;
  }

  async deleteByTokenHash(tokenHash: string): Promise<void> {
    await getDb()
      .delete(sessionsTable)
      .where(eq(sessionsTable.tokenHash, tokenHash));
  }
}
