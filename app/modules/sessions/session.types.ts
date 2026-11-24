import type { sessionsTable } from "@/app/src/db/schema";

export type SessionRecord = typeof sessionsTable.$inferSelect;
export type NewSessionRecord = typeof sessionsTable.$inferInsert;
