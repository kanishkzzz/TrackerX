import { NextResponse } from "next/server";
import { AuthError, AuthService } from "@/app/modules/auth/auth.service";
import { AUTH_SESSION_COOKIE_NAME } from "@/lib/auth-session";
import { signUpSchema } from "@/app/modules/auth/auth.schemas";

const authService = new AuthService();

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const parsed = signUpSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Name, mail, and password are required." }, { status: 400 });
  }

  try {
    const issuedSession = await authService.signUp(parsed.data);
    const response = NextResponse.json({ user: issuedSession.user }, { status: 201 });
    response.cookies.set(AUTH_SESSION_COOKIE_NAME, issuedSession.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      expires: issuedSession.expiresAt,
    });
    return response;
  } catch (error) {
    if (error instanceof AuthError) {
      if (error.code === "EMAIL_ALREADY_EXISTS") {
        return NextResponse.json({ error: "An account with that mail already exists." }, { status: 409 });
      }
      if (error.code === "INVALID_INPUT") {
        return NextResponse.json({ error: "Please check the name, mail, and password." }, { status: 400 });
      }
    }

    return NextResponse.json({ error: "Could not create the account." }, { status: 500 });
  }
}
