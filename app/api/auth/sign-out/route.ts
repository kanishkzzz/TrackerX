import { NextResponse } from "next/server";
import { AuthService } from "@/app/modules/auth/auth.service";
import {
  AUTH_SESSION_COOKIE_NAME,
  getCurrentSessionToken,
} from "@/lib/auth-session";

const authService = new AuthService();

export async function POST() {
  try {
    const token = await getCurrentSessionToken();
    await authService.signOut(token);

    const response = NextResponse.json({ status: "signed_out" });
    response.cookies.delete(AUTH_SESSION_COOKIE_NAME);
    return response;
  } catch {
    return NextResponse.json({ error: "Could not end the session." }, { status: 503 });
  }
}
