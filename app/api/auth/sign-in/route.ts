import { NextResponse } from "next/server";
import { AuthError, AuthService } from "@/app/modules/auth/auth.service";
import { AUTH_SESSION_COOKIE_NAME } from "@/lib/auth-session";
import { signInSchema } from "@/app/modules/auth/auth.schemas";

const authService = new AuthService();

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const parsed = signInSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Mail and password are required." }, { status: 400 });
  }

  try {
    const issuedSession = await authService.signIn(parsed.data);
    const response = NextResponse.json({ user: issuedSession.user });
    response.cookies.set(AUTH_SESSION_COOKIE_NAME, issuedSession.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      expires: issuedSession.expiresAt,
    });
    return response;
  } catch (error) {
    if (error instanceof AuthError && error.code === "INVALID_INPUT") {
      return NextResponse.json({ error: "Please check the mail and password." }, { status: 400 });
    }
    if (error instanceof AuthError && error.code === "INVALID_CREDENTIALS") {
      return NextResponse.json({ error: "Invalid mail or password." }, { status: 401 });
    }

    return NextResponse.json({ error: "Could not sign in." }, { status: 500 });
  }
}
