import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { connection } from "next/server";
import { Suspense } from "react";
import { Dashboard } from "@/app/components/dashboard";
import { getCurrentUser } from "@/lib/auth-session";

export const metadata: Metadata = {
  title: "My tasks | TaskNest",
  description: "Organize and prioritize your tasks with TaskNest.",
};

async function getUserBeforeTimeout() {
  let timeoutId: ReturnType<typeof setTimeout> | undefined;
  try {
    return await Promise.race([
      getCurrentUser(),
      new Promise<never>((_resolve, reject) => {
        timeoutId = setTimeout(() => reject(new Error("Dashboard session lookup timed out.")), 8000);
      }),
    ]);
  } finally {
    if (timeoutId) clearTimeout(timeoutId);
  }
}

async function AuthenticatedDashboard() {
  await connection();

  let user: Awaited<ReturnType<typeof getCurrentUser>>;

  try {
    user = await getUserBeforeTimeout();
  } catch {
    return <DashboardUnavailable />;
  }

  if (!user) redirect("/sign-in");

  return (
    <Dashboard
      initialUser={{
        id: user.id,
        name: user.name,
        mail: user.mail,
        createdAt: user.createdAt.toISOString(),
      }}
    />
  );
}

function DashboardUnavailable() {
  return (
    <main className="dashboard-unavailable">
      <section>
        <Image src="/iconicicon.jpg" alt="" width={44} height={44} priority />
        <p>WORKSPACE UNAVAILABLE</p>
        <h1>We couldn’t load your workspace.</h1>
        <span>Check your connection and try again.</span>
        <div>
          <Link href="/dashboard">Try again</Link>
          <Link href="/sign-in">Sign in</Link>
        </div>
      </section>
    </main>
  );
}

function DashboardLoading() {
  return (
    <main className="dashboard-route-loading" aria-busy="true" aria-live="polite">
      <Image src="/iconicicon.jpg" alt="" width={38} height={38} priority />
      <span>Loading your workspace…</span>
    </main>
  );
}

export default function DashboardPage() {
  return (
    <Suspense fallback={<DashboardLoading />}>
      <AuthenticatedDashboard />
    </Suspense>
  );
}
