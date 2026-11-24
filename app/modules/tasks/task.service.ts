import "server-only";

import { TaskRepository } from "./task.repository";
import { createTaskSchema, updateTaskSchema } from "./task.schemas";
import type {
  CreateTaskInput,
  TaskErrorCode,
  TaskRecord,
  UpdateTaskInput,
} from "./task.types";

export class TaskError extends Error {
  constructor(readonly code: TaskErrorCode) {
    super(code);
    this.name = "TaskError";
  }
}

export class TaskService {
  constructor(private readonly tasks = new TaskRepository()) {}

  async createTask(userId: string, input: CreateTaskInput): Promise<TaskRecord> {
    const parsed = createTaskSchema.safeParse(input);
    if (!parsed.success) throw new TaskError("INVALID_INPUT");
    const changes = parsed.data;
    return this.tasks.create({
      userId,
      title: changes.title!,
      description: changes.description!,
      severity: changes.severity ?? "medium",
    });
  }

  listTasks(userId: string): Promise<TaskRecord[]> {
    return this.tasks.listForUser(userId);
  }

  getTask(userId: string, taskId: string): Promise<TaskRecord | null> {
    return this.tasks.findForUser(userId, taskId);
  }

  async updateTask(
    userId: string,
    taskId: string,
    input: UpdateTaskInput,
  ): Promise<TaskRecord | null> {
    const parsed = updateTaskSchema.safeParse(input);
    if (!parsed.success) throw new TaskError("INVALID_INPUT");
    return this.tasks.updateForUser(userId, taskId, parsed.data);
  }

  deleteTask(userId: string, taskId: string): Promise<boolean> {
    return this.tasks.deleteForUser(userId, taskId);
  }

}
