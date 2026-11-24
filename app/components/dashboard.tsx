"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { taskFormSchema } from "@/app/modules/tasks/task.schemas";
import type {
  DashboardTask,
  DashboardTaskFilter,
  DashboardTaskFormValues,
  DashboardUser,
} from "./dashboard.types";

type ApiError = { error?: string };

export function Dashboard({ initialUser }: { initialUser: DashboardUser }) {
  const router = useRouter();
  const user = initialUser;
  const [tasks, setTasks] = useState<DashboardTask[]>([]);
  const [activeFilter, setActiveFilter] = useState<DashboardTaskFilter>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [pageError, setPageError] = useState("");
  const [isTaskDialogOpen, setIsTaskDialogOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<DashboardTask | null>(null);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<DashboardTaskFormValues>({
    resolver: zodResolver(taskFormSchema),
    defaultValues: { title: "", description: "", severity: "medium" },
  });

  useEffect(() => {
    const controller = new AbortController();

    async function loadTasks() {
      try {
        const response = await fetch("/api/tasks", {
          cache: "no-store",
          signal: AbortSignal.any([controller.signal, AbortSignal.timeout(15000)]),
        });
        const data = (await response.json()) as { tasks?: DashboardTask[]; error?: string };

        if (response.status === 401) {
          router.replace("/sign-in");
          return;
        }
        if (!response.ok) throw new Error(data.error ?? "Could not load your tasks.");
        setTasks(data.tasks ?? []);
      } catch (error) {
        if (controller.signal.aborted) return;
        setPageError(error instanceof Error ? error.message : "Could not load your tasks.");
      } finally {
        if (!controller.signal.aborted) setIsLoading(false);
      }
    }

    void loadTasks();
    return () => controller.abort();
  }, [router]);

  const todoTasks = useMemo(() => tasks.filter((task) => task.status === "todo"), [tasks]);
  const doneTasks = useMemo(() => tasks.filter((task) => task.status === "done"), [tasks]);
  const visibleTasks = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return tasks.filter((task) => {
      const matchesFilter = activeFilter === "all" || task.status === activeFilter;
      const matchesSearch = !query || `${task.title} ${task.description ?? ""}`.toLowerCase().includes(query);
      return matchesFilter && matchesSearch;
    });
  }, [activeFilter, searchQuery, tasks]);

  function openCreateDialog() {
    setEditingTask(null);
    reset({ title: "", description: "", severity: "medium" });
    setIsTaskDialogOpen(true);
  }

  function openEditDialog(task: DashboardTask) {
    setEditingTask(task);
    reset({ title: task.title, description: task.description ?? "", severity: task.severity });
    setIsTaskDialogOpen(true);
  }

  async function saveTask(values: DashboardTaskFormValues) {
    setIsSaving(true);
    setPageError("");
    try {
      const response = await fetch(editingTask ? `/api/tasks/${editingTask.id}` : "/api/tasks", {
        method: editingTask ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...values, title: values.title.trim(), description: values.description.trim() }),
      });
      const data = (await response.json()) as { task?: DashboardTask; error?: string };
      if (!response.ok || !data.task) throw new Error(data.error ?? "Could not save this task.");

      setTasks((current) => editingTask
        ? current.map((task) => task.id === data.task!.id ? data.task! : task)
        : [data.task!, ...current]);
      setIsTaskDialogOpen(false);
    } catch (error) {
      setPageError(error instanceof Error ? error.message : "Could not save this task.");
    } finally {
      setIsSaving(false);
    }
  }

  async function toggleTask(task: DashboardTask) {
    const nextStatus = task.status === "done" ? "todo" : "done";
    try {
      const response = await fetch(`/api/tasks/${task.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: nextStatus }),
      });
      const data = (await response.json()) as { task?: DashboardTask; error?: string };
      if (!response.ok || !data.task) throw new Error(data.error ?? "Could not update this task.");
      setTasks((current) => current.map((item) => item.id === task.id ? data.task! : item));
    } catch (error) {
      setPageError(error instanceof Error ? error.message : "Could not update this task.");
    }
  }

  async function deleteTask(task: DashboardTask) {
    if (!window.confirm(`Delete “${task.title}”?`)) return;
    try {
      const response = await fetch(`/api/tasks/${task.id}`, { method: "DELETE" });
      const data = (await response.json()) as ApiError;
      if (!response.ok) throw new Error(data.error ?? "Could not delete this task.");
      setTasks((current) => current.filter((item) => item.id !== task.id));
    } catch (error) {
      setPageError(error instanceof Error ? error.message : "Could not delete this task.");
    }
  }

  async function signOut() {
    try {
      await fetch("/api/auth/sign-out", { method: "POST" });
    } finally {
      router.replace("/sign-in");
      router.refresh();
    }
  }

  const firstName = user?.name.trim().split(/\s+/)[0] ?? "there";
  const progress = tasks.length ? Math.round((doneTasks.length / tasks.length) * 100) : 0;

  return (
    <main className="dashboard-shell">
      <aside className="dashboard-sidebar">
        <Link className="dashboard-brand" href="/" aria-label="TaskNest home">
          <Image src="/iconicicon.jpg" alt="" width={36} height={36} priority />
          <span>tasknest</span>
        </Link>
        <span className="dashboard-nav-label">WORKSPACE</span>
        <nav className="dashboard-nav" aria-label="Dashboard navigation">
          <a className="dashboard-nav-item is-active" href="#tasks"><span>▤</span> My tasks</a>
          <a className="dashboard-nav-item" href="#overview"><span>◷</span> Overview</a>
        </nav>
        <div className="sidebar-bottom">
          <div className="sidebar-tip"><span>✦</span><strong>One step at a time</strong><p>Small, steady progress is still progress.</p></div>
          <button className="sidebar-signout" onClick={() => void signOut()} type="button"><span>↪</span> Sign out</button>
        </div>
      </aside>

      <section className="dashboard-main">
        <header className="dashboard-topbar">
          <div className="dashboard-breadcrumb">Workspace <span>/</span> <strong>My tasks</strong></div>
          <div className="dashboard-user">
            <span className="dashboard-user-avatar">{user?.name.slice(0, 1).toUpperCase() ?? "•"}</span>
            <span>{user?.name ?? "Loading…"}</span>
          </div>
        </header>

        <div className="dashboard-content">
          <div className="dashboard-welcome" id="overview">
            <div>
              <p className="dashboard-date">YOUR DAY, AT A GLANCE</p>
              <h1>{`Welcome, ${firstName}.`}</h1>
              <p className="dashboard-subtitle">Here’s what’s on your plate today.</p>
            </div>
            <button className="dashboard-create-button" onClick={openCreateDialog} type="button"><span>＋</span> New task</button>
          </div>

          <div className="dashboard-stat-grid">
            <article className="dashboard-stat-card"><span className="dashboard-stat-icon stat-icon-total">▤</span><span className="dashboard-stat-label">All tasks</span><strong>{isLoading ? "—" : tasks.length}</strong><small>Across your list</small></article>
            <article className="dashboard-stat-card"><span className="dashboard-stat-icon stat-icon-open">◷</span><span className="dashboard-stat-label">To do</span><strong>{isLoading ? "—" : todoTasks.length}</strong><small>Ready when you are</small></article>
            <article className="dashboard-stat-card"><span className="dashboard-stat-icon stat-icon-done">✓</span><span className="dashboard-stat-label">Completed</span><strong>{isLoading ? "—" : doneTasks.length}</strong><small>Look at you go</small></article>
            <article className="dashboard-progress-card"><div className="dashboard-progress-top"><span>Daily progress</span><strong>{isLoading ? "—" : `${progress}%`}</strong></div><div className="dashboard-progress-track"><span style={{ width: `${isLoading ? 0 : progress}%` }} /></div><small>{tasks.length ? `${doneTasks.length} of ${tasks.length} tasks completed` : "Add a task to get started"}</small></article>
          </div>

          {pageError && <p className="dashboard-alert" role="alert">{pageError}</p>}

          <section className="task-board" id="tasks">
            <div className="task-board-header">
              <div><h2>Your tasks</h2><p>Keep the next step in view.</p></div>
              <label className="task-search"><span aria-hidden="true">⌕</span><input aria-label="Search tasks" onChange={(event) => setSearchQuery(event.target.value)} placeholder="Search tasks" value={searchQuery} /></label>
            </div>
            <div className="task-board-toolbar">
              <div className="task-filter-tabs" role="tablist" aria-label="Filter tasks">
                {(["all", "todo", "done"] as const).map((filter) => (
                  <button aria-selected={activeFilter === filter} className={activeFilter === filter ? "is-selected" : ""} key={filter} onClick={() => setActiveFilter(filter)} role="tab" type="button">
                    {filter === "all" ? "All tasks" : filter === "todo" ? "To do" : "Completed"}
                    <span>{filter === "all" ? tasks.length : filter === "todo" ? todoTasks.length : doneTasks.length}</span>
                  </button>
                ))}
              </div>
              <span className="task-sort-label">Sorted by newest</span>
            </div>

            <div className="task-list">
              {isLoading ? <div className="task-empty"><span className="task-empty-icon">◌</span><strong>Loading your tasks…</strong></div> : visibleTasks.length ? visibleTasks.map((task) => (
                <article className={`task-row-card ${task.status === "done" ? "is-complete" : ""}`} key={task.id}>
                  <button aria-label={task.status === "done" ? `Mark ${task.title} as to do` : `Mark ${task.title} complete`} className={`task-row-check ${task.status === "done" ? "is-checked" : ""}`} onClick={() => void toggleTask(task)} type="button">{task.status === "done" ? "✓" : ""}</button>
                  <div className="task-row-copy"><h3>{task.title}</h3>{task.description && <p>{task.description}</p>}</div>
                  <span className={`task-priority priority-${task.severity}`}><i />{task.severity}</span>
                  <div className="task-row-actions"><button aria-label={`Edit ${task.title}`} onClick={() => openEditDialog(task)} type="button">Edit</button><button aria-label={`Delete ${task.title}`} onClick={() => void deleteTask(task)} type="button">Delete</button></div>
                </article>
              )) : (
                <div className="task-empty"><span className="task-empty-icon">✓</span><strong>{searchQuery ? "No matching tasks" : activeFilter === "done" ? "Nothing completed yet" : activeFilter === "todo" ? "You’re all caught up" : "Your list starts here"}</strong><p>{searchQuery ? "Try a different search." : "Add a task and make a little progress."}</p>{!searchQuery && <button onClick={openCreateDialog} type="button">Create your first task <span>→</span></button>}</div>
              )}
            </div>
          </section>

          <footer className="dashboard-footer"><span>TaskNest</span><span>Make space for what matters.</span></footer>
        </div>
      </section>

      {isTaskDialogOpen && (
        <div className="task-modal-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget && !isSaving) setIsTaskDialogOpen(false); }}>
          <section aria-labelledby="task-modal-title" aria-modal="true" className="task-modal" role="dialog">
            <div className="task-modal-heading"><div><span>{editingTask ? "UPDATE YOUR LIST" : "MAKE A LITTLE PROGRESS"}</span><h2 id="task-modal-title">{editingTask ? "Edit task" : "New task"}</h2></div><button aria-label="Close dialog" disabled={isSaving} onClick={() => setIsTaskDialogOpen(false)} type="button">×</button></div>
            <form className="task-modal-form" onSubmit={handleSubmit(saveTask)}>
              <label className="task-modal-field"><span>Title</span><input autoFocus maxLength={200} placeholder="What needs doing?" {...register("title", { required: "Add a title for your task.", maxLength: { value: 200, message: "Keep the title under 200 characters." } })} />{errors.title && <small>{errors.title.message}</small>}</label>
              <label className="task-modal-field"><span>Description <em>Optional</em></span><textarea maxLength={2000} placeholder="Add a few details" rows={4} {...register("description")} /></label>
              <label className="task-modal-field"><span>Priority</span><select {...register("severity", { required: true })}><option value="low">Low</option><option value="medium">Medium</option><option value="high">High</option></select></label>
              <div className="task-modal-actions"><button className="task-modal-cancel" disabled={isSaving} onClick={() => setIsTaskDialogOpen(false)} type="button">Cancel</button><button className="task-modal-save" disabled={isSaving} type="submit">{isSaving ? "Saving…" : editingTask ? "Save changes" : "Add task"}</button></div>
            </form>
          </section>
        </div>
      )}
    </main>
  );
}
