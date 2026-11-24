import type { usersTable } from "@/app/src/db/schema";

export type UserRecord = typeof usersTable.$inferSelect;
export type NewUserRecord = typeof usersTable.$inferInsert;
export type PublicUser = Pick<UserRecord, "id" | "name" | "mail" | "createdAt">;
