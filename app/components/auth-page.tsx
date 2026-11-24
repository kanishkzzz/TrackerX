"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createAuthFormSchema } from "@/app/modules/auth/auth.schemas";
import type { AuthFormValues, AuthMode } from "@/app/modules/auth/auth.types";

export function AuthPage({ mode }: { mode: AuthMode }) {
  const router = useRouter();
  const isSignUp = mode === "sign-up";
  const [error, setError] = useState("");
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<AuthFormValues>({
    resolver: zodResolver(createAuthFormSchema(mode)),
    defaultValues: { name: "", mail: "", password: "" },
  });

  async function submitForm(values: AuthFormValues) {
    setError("");
    const payload = {
      ...(isSignUp ? { name: values.name.trim() } : {}),
      mail: values.mail.trim(),
      password: values.password,
    };

    try {
      const response = await fetch(`/api/auth/${mode}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = (await response.json()) as { error?: string };

      if (!response.ok) {
        setError(result.error ?? "We couldn’t complete that request. Please try again.");
        return;
      }

      reset({ name: "", mail: "", password: "" });
      router.push("/dashboard");
      router.refresh();
    } catch {
      setError("Unable to connect. Check your connection and try again.");
    }
  }

  return (
    <main className="auth-shell">
      <section className="auth-form-side">
        <Link className="auth-brand" href="/" aria-label="TaskNest home">
          <Image src="/iconicicon.jpg" alt="" width={38} height={38} priority />
          <span>tasknest</span>
        </Link>

        <div className="auth-form-content">
          <div className="auth-heading">
            <span className="auth-kicker">{isSignUp ? "A calmer way to get things done" : "Good to see you again"}</span>
            <h1>{isSignUp ? "Create your account" : "Welcome back"}</h1>
            <p>{isSignUp ? "Make a little room for what matters today." : "Sign in to pick up where you left off."}</p>
          </div>

          <form autoComplete="off" className="auth-form" key={mode} onSubmit={handleSubmit(submitForm)}>
            {isSignUp && (
              <label className="auth-field">
                <span>Name</span>
                <input autoComplete="off" maxLength={120} placeholder="Your name" {...register("name")} />
                {errors.name && <small className="auth-error">{errors.name.message}</small>}
              </label>
            )}
            <label className="auth-field">
              <span>Email</span>
              <input autoComplete="off" maxLength={254} placeholder="you@example.com" type="email" {...register("mail")} />
              {errors.mail && <small className="auth-error">{errors.mail.message}</small>}
            </label>
            <label className="auth-field">
              <span>Password</span>
              <input autoComplete="off" maxLength={72} minLength={8} placeholder="At least 8 characters" type="password" {...register("password")} />
              {errors.password && <small className="auth-error">{errors.password.message}</small>}
            </label>

            {error && <p className="auth-error" role="alert">{error}</p>}

            <button className="auth-submit" disabled={isSubmitting} type="submit">
              {isSubmitting ? "Please wait…" : isSignUp ? "Create account" : "Log in"}
              <span aria-hidden="true">→</span>
            </button>
          </form>

          <p className="auth-switch">
            {isSignUp ? "Already have an account?" : "New to TaskNest?"}{" "}
            <Link href={isSignUp ? "/sign-in" : "/sign-up"}>{isSignUp ? "Log in" : "Create an account"}</Link>
          </p>
        </div>

        <span className="auth-footer">Your tasks stay yours.</span>
      </section>

      <aside className="auth-art" aria-label="Motivational mountain image">
        <Image
          className="auth-promo-image"
          src="/download.png"
          alt="A mountain landscape with the message, Sometimes you win and sometimes you learn."
          fill
          priority
          sizes="(max-width: 680px) 100vw, 50vw"
        />
      </aside>
    </main>
  );
}
