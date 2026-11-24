import { AuthPage } from "@/app/components/auth-page";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Log in | TaskNest",
  description: "Log in to your TaskNest account.",
};

export default function SignInPage() {
  return <AuthPage mode="sign-in" />;
}
