import "server-only";

import bcrypt from "bcryptjs";
import { createHash, randomBytes } from "node:crypto";
import { SessionRepository } from "@/app/modules/sessions/session.repository";
import { UserRepository } from "@/app/modules/users/user.repository";
import { signInSchema, signUpSchema } from "./auth.schemas";
import type {
  AuthErrorCode,
  IssuedSession,
  SignInInput,
  SignUpInput,
} from "./auth.types";
import type { PublicUser, UserRecord } from "@/app/modules/users/user.types";

const BCRYPT_ROUNDS = 12;
const SESSION_TTL_MS = 7 * 24 * 60 * 60 * 1000;

export class AuthError extends Error {
  constructor(readonly code: AuthErrorCode) {
    super(code);
    this.name = "AuthError";
  }
}

export class AuthService {
  constructor(
    private readonly users = new UserRepository(),
    private readonly sessions = new SessionRepository(),
  ) {}

  async signUp(input: SignUpInput): Promise<IssuedSession> {
    const parsed = signUpSchema.safeParse(input);
    if (!parsed.success) throw new AuthError("INVALID_INPUT");
    const { name, mail, password } = parsed.data;

    const passwordHash = await bcrypt.hash(password, BCRYPT_ROUNDS);
    const user = await this.users.create({ name, mail, passwordHash });
    if (!user) {
      throw new AuthError("EMAIL_ALREADY_EXISTS");
    }

    return this.issueSession(user);
  }

  async signIn(input: SignInInput): Promise<IssuedSession> {
    const parsed = signInSchema.safeParse(input);
    if (!parsed.success) throw new AuthError("INVALID_INPUT");
    const { mail, password } = parsed.data;

    const user = await this.users.findByMail(mail);
    if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
      throw new AuthError("INVALID_CREDENTIALS");
    }

    return this.issueSession(user);
  }

  async getUserForSession(token: string | undefined): Promise<PublicUser | null> {
    if (!token) return null;

    const session = await this.sessions.findActiveByTokenHash(
      this.hashToken(token),
    );
    if (!session) return null;

    const user = await this.users.findById(session.userId);
    return user ? this.toPublicUser(user) : null;
  }

  async signOut(token: string | undefined): Promise<void> {
    if (!token) return;
    await this.sessions.deleteByTokenHash(this.hashToken(token));
  }

  private async issueSession(user: UserRecord): Promise<IssuedSession> {
    const token = randomBytes(32).toString("base64url");
    const expiresAt = new Date(Date.now() + SESSION_TTL_MS);

    await this.sessions.create({
      userId: user.id,
      tokenHash: this.hashToken(token),
      expiresAt,
    });

    return { user: this.toPublicUser(user), token, expiresAt };
  }

  private hashToken(token: string): string {
    return createHash("sha256").update(token).digest("hex");
  }

  private toPublicUser(user: UserRecord): PublicUser {
    return {
      id: user.id,
      name: user.name,
      mail: user.mail,
      createdAt: user.createdAt,
    };
  }
}
