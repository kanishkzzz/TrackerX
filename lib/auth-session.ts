import "server-only";

import { cookies } from "next/headers";
import { AuthService } from "@/app/modules/auth/auth.service";

export const AUTH_SESSION_COOKIE_NAME = "tasknest_session";

const authService = new AuthService();

export async function getCurrentUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get(AUTH_SESSION_COOKIE_NAME)?.value;
  return authService.getUserForSession(token);
}

export async function getCurrentSessionToken(): Promise<string | undefined> {
  const cookieStore = await cookies();
  return cookieStore.get(AUTH_SESSION_COOKIE_NAME)?.value;
}
