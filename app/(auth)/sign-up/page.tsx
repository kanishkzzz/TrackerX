import { AuthPage } from "@/app/components/auth-page";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Create an account | TaskNest",
  description: "Create your TaskNest account and organize your day.",
};

export default function SignUpPage() {
  return <AuthPage mode="sign-up" />;
}
