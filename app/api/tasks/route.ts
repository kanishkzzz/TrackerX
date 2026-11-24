import { NextResponse } from "next/server";
import { TaskError, TaskService } from "@/app/modules/tasks/task.service";
import { createTaskSchema } from "@/app/modules/tasks/task.schemas";
import { getCurrentUser } from "@/lib/auth-session";

const taskService = new TaskService();
export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: "Not signed in." }, { status: 401 });

    const tasks = await taskService.listTasks(user.id);
    return NextResponse.json({ tasks });
  } catch {
    return NextResponse.json({ error: "Could not load tasks." }, { status: 503 });
  }
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const parsed = createTaskSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Title and description are required; severity must be low, medium, or high." },
      { status: 400 },
    );
  }

  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: "Not signed in." }, { status: 401 });

    const task = await taskService.createTask(user.id, parsed.data);
    return NextResponse.json({ task }, { status: 201 });
  } catch (error) {
    if (error instanceof TaskError) {
      return NextResponse.json({ error: "Invalid task details." }, { status: 400 });
    }
    return NextResponse.json({ error: "Could not create the task." }, { status: 503 });
  }
}
