import { and, desc, eq } from "drizzle-orm";
import { getDb } from "@/lib/db";
import { tasksTable } from "@/app/src/db/schema";
import type {
  NewTaskRecord,
  TaskRecord,
  TaskUpdateFields,
} from "./task.types";

export class TaskRepository {
  async create(input: NewTaskRecord): Promise<TaskRecord> {
    const [task] = await getDb().insert(tasksTable).values(input).returning();
    if (!task) throw new Error("Could not create the task.");
    return task;
  }

  async listForUser(userId: string): Promise<TaskRecord[]> {
    return getDb()
      .select()
      .from(tasksTable)
      .where(eq(tasksTable.userId, userId))
      .orderBy(desc(tasksTable.createdAt));
  }

  async findForUser(userId: string, taskId: string): Promise<TaskRecord | null> {
    const [task] = await getDb()
      .select()
      .from(tasksTable)
      .where(and(eq(tasksTable.userId, userId), eq(tasksTable.id, taskId)))
      .limit(1);
    return task ?? null;
  }

  async updateForUser(
    userId: string,
    taskId: string,
    changes: TaskUpdateFields,
  ): Promise<TaskRecord | null> {
    const [task] = await getDb()
      .update(tasksTable)
      .set(changes)
      .where(and(eq(tasksTable.userId, userId), eq(tasksTable.id, taskId)))
      .returning();
    return task ?? null;
  }

  async deleteForUser(userId: string, taskId: string): Promise<boolean> {
    const deleted = await getDb()
      .delete(tasksTable)
      .where(and(eq(tasksTable.userId, userId), eq(tasksTable.id, taskId)))
      .returning();
    return deleted.length > 0;
  }
}
