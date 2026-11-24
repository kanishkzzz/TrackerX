import { z } from "zod";

const mailSchema = z.string().trim().toLowerCase().min(1, "Enter your email.").max(254, "Email is too long.").email("Enter a valid email.");
const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters.")
  // bcrypt only considers the first 72 UTF-8 bytes; reject longer passwords.
  .refine((value) => new TextEncoder().encode(value).length <= 72, "Password must be at most 72 UTF-8 bytes.");
const nameSchema = z.string().trim().min(1, "Enter your name.").max(120, "Name must be at most 120 characters.");

export const signUpSchema = z.object({
  name: nameSchema,
  mail: mailSchema,
  password: passwordSchema,
}).strict();

export const signInSchema = z.object({
  mail: mailSchema,
  password: passwordSchema,
}).strict();

const authFormBaseSchema = z.object({
  name: z.string().trim().max(120, "Name must be at most 120 characters."),
  mail: mailSchema,
  password: passwordSchema,
});

export type AuthMode = "sign-in" | "sign-up";

export function createAuthFormSchema(mode: AuthMode) {
  return mode === "sign-up"
    ? authFormBaseSchema.extend({ name: nameSchema })
    : authFormBaseSchema;
}

export const authFormSchema = authFormBaseSchema;
