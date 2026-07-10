import type { Request, Response } from "express";
import { z } from "zod";
import { registerUser, loginUser, refreshTokens, getMe } from "../services/auth.service.js";
import { sendSuccess, sendError } from "../utils/response.js";

const registerSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(8),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

const refreshSchema = z.object({
  refreshToken: z.string().min(1),
});

export async function register(req: Request, res: Response): Promise<void> {
  const parsed = registerSchema.safeParse(req.body);
  if (!parsed.success) {
    sendError(res, parsed.error.issues[0]?.message ?? "Invalid input", 422);
    return;
  }

  try {
    const result = await registerUser(parsed.data);
    sendSuccess(res, result, 201);
  } catch (err) {
    sendError(res, err instanceof Error ? err.message : "Registration failed");
  }
}

export async function login(req: Request, res: Response): Promise<void> {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) {
    sendError(res, parsed.error.issues[0]?.message ?? "Invalid input", 422);
    return;
  }

  try {
    const result = await loginUser(parsed.data);
    sendSuccess(res, result);
  } catch (err) {
    sendError(res, err instanceof Error ? err.message : "Login failed", 401);
  }
}

export async function refresh(req: Request, res: Response): Promise<void> {
  const parsed = refreshSchema.safeParse(req.body);
  if (!parsed.success) {
    sendError(res, "refreshToken is required", 422);
    return;
  }

  try {
    const tokens = await refreshTokens(parsed.data.refreshToken);
    sendSuccess(res, tokens);
  } catch {
    sendError(res, "Invalid or expired refresh token", 401);
  }
}

export async function me(req: Request, res: Response): Promise<void> {
  if (!req.user) {
    sendError(res, "Unauthorized", 401);
    return;
  }

  try {
    const user = await getMe(req.user.userId);
    sendSuccess(res, user);
  } catch (err) {
    sendError(res, err instanceof Error ? err.message : "Not found", 404);
  }
}
