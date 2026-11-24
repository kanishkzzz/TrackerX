import type { PublicUser } from "@/app/modules/users/user.types";
import type { z } from "zod";
import type { authFormSchema, signInSchema, signUpSchema, AuthMode } from "./auth.schemas";

export type { AuthMode };
export type SignUpInput = z.infer<typeof signUpSchema>;
export type SignInInput = z.infer<typeof signInSchema>;
export type AuthFormValues = z.infer<typeof authFormSchema>;

export interface IssuedSession {
  user: PublicUser;
  token: string;
  expiresAt: Date;
}

export type AuthErrorCode =
  | "INVALID_INPUT"
  | "EMAIL_ALREADY_EXISTS"
  | "INVALID_CREDENTIALS";
