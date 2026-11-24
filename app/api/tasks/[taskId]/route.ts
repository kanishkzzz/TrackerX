import { NextResponse } from "next/server";
import { TaskError, TaskService } from "@/app/modules/tasks/task.service";
import { updateTaskSchema } from "@/app/modules/tasks/task.schemas";
import { getCurrentUser } from "@/lib/auth-session";

const taskService = new TaskService();
type TaskRouteContext = { params: Promise<{ taskId: string }> };

function isTaskId(value: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value);
}

export async function GET(_request: Request, context: TaskRouteContext) {
  const { taskId } = await context.params;
  if (!isTaskId(taskId)) {
    return NextResponse.json({ error: "Invalid task id." }, { status: 400 });
  }

  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: "Not signed in." }, { status: 401 });

    const task = await taskService.getTask(user.id, taskId);
    if (!task) return NextResponse.json({ error: "Task not found." }, { status: 404 });
    return NextResponse.json({ task });
  } catch {
    return NextResponse.json({ error: "Could not load the task." }, { status: 503 });
  }
}

export async function PATCH(request: Request, context: TaskRouteContext) {
  const { taskId } = await context.params;
  if (!isTaskId(taskId)) {
    return NextResponse.json({ error: "Invalid task id." }, { status: 400 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }
  const parsed = updateTaskSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Provide valid task fields to update." }, { status: 400 });
  }

  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: "Not signed in." }, { status: 401 });

    const task = await taskService.updateTask(user.id, taskId, parsed.data);
    if (!task) return NextResponse.json({ error: "Task not found." }, { status: 404 });
    return NextResponse.json({ task });
  } catch (error) {
    if (error instanceof TaskError) {
      return NextResponse.json({ error: "Invalid task details." }, { status: 400 });
    }
    return NextResponse.json({ error: "Could not update the task." }, { status: 503 });
  }
}

export async function DELETE(_request: Request, context: TaskRouteContext) {
  const { taskId } = await context.params;
  if (!isTaskId(taskId)) {
    return NextResponse.json({ error: "Invalid task id." }, { status: 400 });
  }

  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: "Not signed in." }, { status: 401 });

    const deleted = await taskService.deleteTask(user.id, taskId);
    if (!deleted) return NextResponse.json({ error: "Task not found." }, { status: 404 });
    return NextResponse.json({ status: "deleted" });
  } catch {
    return NextResponse.json({ error: "Could not delete the task." }, { status: 503 });
  }
}
