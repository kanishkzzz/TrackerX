import type { taskSeverity, taskStatus, tasksTable } from "@/app/src/db/schema";
import type { z } from "zod";
import type { createTaskSchema, taskFormSchema, updateTaskSchema } from "./task.schemas";

export type TaskRecord = typeof tasksTable.$inferSelect;
export type NewTaskRecord = typeof tasksTable.$inferInsert;
export type TaskSeverity = (typeof taskSeverity.enumValues)[number];
export type TaskStatus = (typeof taskStatus.enumValues)[number];

export type CreateTaskInput = z.infer<typeof createTaskSchema>;
export type UpdateTaskInput = z.infer<typeof updateTaskSchema>;
export type TaskFormValues = z.infer<typeof taskFormSchema>;

export type TaskUpdateFields = Partial<
  Pick<TaskRecord, "title" | "description" | "severity" | "status">
>;

export type TaskErrorCode = "INVALID_INPUT";
