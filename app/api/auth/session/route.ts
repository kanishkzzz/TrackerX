import { NextResponse } from "next/server";
import { AUTH_SESSION_COOKIE_NAME, getCurrentUser } from "@/lib/auth-session";

export async function GET() {
  try {
    const user = await getCurrentUser();

    if (!user) {
      const response = NextResponse.json({ error: "Not signed in." }, { status: 401 });
      response.cookies.delete(AUTH_SESSION_COOKIE_NAME);
      return response;
    }

    return NextResponse.json({ user });
  } catch {
    return NextResponse.json({ error: "Could not read the session." }, { status: 503 });
  }
}
