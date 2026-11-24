CREATE TYPE "task_severity" AS ENUM('low', 'medium', 'high');--> statement-breakpoint
ALTER TABLE "tasks" ADD COLUMN "severity" "task_severity" DEFAULT 'medium'::"task_severity" NOT NULL;