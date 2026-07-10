import { findUserByEmail } from "../repositories/user.repository.js";
import { hashPassword, verifyPassword } from "../utils/password.js";
import { signAccessToken, signRefreshToken, verifyRefreshToken } from "../utils/jwt.js";
import { prisma } from "../lib/prisma.js";

export type RegisterInput = {
  name: string;
  email: string;
  password: string;
};

export type LoginInput = {
  email: string;
  password: string;
};

export type AuthTokens = {
  accessToken: string;
  refreshToken: string;
};

export type SafeUser = {
  id: string;
  name: string;
  email: string;
  avatarUrl: string | null;
  createdAt: Date;
};

function toSafeUser(user: { id: string; name: string; email: string; avatarUrl: string | null; createdAt: Date }): SafeUser {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    avatarUrl: user.avatarUrl,
    createdAt: user.createdAt,
  };
}

export async function registerUser(input: RegisterInput): Promise<{ user: SafeUser; tokens: AuthTokens }> {
  const existing = await findUserByEmail(input.email);
  if (existing) {
    throw new Error("An account with this email already exists.");
  }

  const hashed = await hashPassword(input.password);
  const user = await prisma.user.create({
    data: {
      name: input.name,
      email: input.email,
      password: hashed,
    },
  });

  const tokens = issueTokens(user.id, user.email);
  return { user: toSafeUser(user), tokens };
}

export async function loginUser(input: LoginInput): Promise<{ user: SafeUser; tokens: AuthTokens }> {
  const user = await findUserByEmail(input.email);
  if (!user || !user.password) {
    throw new Error("Invalid email or password.");
  }

  const valid = await verifyPassword(input.password, user.password);
  if (!valid) {
    throw new Error("Invalid email or password.");
  }

  const tokens = issueTokens(user.id, user.email);
  return { user: toSafeUser(user), tokens };
}

export async function refreshTokens(token: string): Promise<AuthTokens> {
  const payload = verifyRefreshToken(token);
  return issueTokens(payload.userId, payload.email);
}

export async function getMe(userId: string): Promise<SafeUser> {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) {
    throw new Error("User not found.");
  }
  return toSafeUser(user);
}

function issueTokens(userId: string, email: string): AuthTokens {
  const payload = { userId, email, provider: "LOCAL" as const };
  return {
    accessToken: signAccessToken(payload),
    refreshToken: signRefreshToken(payload),
  };
}
