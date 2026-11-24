export type DashboardTaskStatus = "todo" | "done";
export type DashboardTaskSeverity = "low" | "medium" | "high";
export type DashboardTaskFilter = "all" | "todo" | "done";

export interface DashboardTask {
  id: string;
  title: string;
  description: string | null;
  status: DashboardTaskStatus;
  severity: DashboardTaskSeverity;
  createdAt: string;
  updatedAt: string;
}

export interface DashboardUser {
  id: string;
  name: string;
  mail: string;
  createdAt: string;
}

export type { TaskFormValues as DashboardTaskFormValues } from "@/app/modules/tasks/task.types";
