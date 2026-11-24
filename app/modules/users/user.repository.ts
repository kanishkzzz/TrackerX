import { eq } from "drizzle-orm";
import { getDb } from "@/lib/db";
import { usersTable } from "@/app/src/db/schema";
import type { NewUserRecord, UserRecord } from "./user.types";

export class UserRepository {
  async findByMail(mail: string): Promise<UserRecord | null> {
    const [user] = await getDb()
      .select()
      .from(usersTable)
      .where(eq(usersTable.mail, mail))
      .limit(1);

    return user ?? null;
  }

  async findById(id: string): Promise<UserRecord | null> {
    const [user] = await getDb()
      .select()
      .from(usersTable)
      .where(eq(usersTable.id, id))
      .limit(1);

    return user ?? null;
  }

  async create(input: NewUserRecord): Promise<UserRecord | null> {
    const [user] = await getDb()
      .insert(usersTable)
      .values(input)
      .onConflictDoNothing()
      .returning();

    return user ?? null;
  }
}
