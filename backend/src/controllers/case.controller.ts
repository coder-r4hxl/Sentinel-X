import type { Request, Response } from "express";
import { z } from "zod";
import {
  createCaseForUser,
  getCasesForUser,
  getCaseForUser,
  updateCaseForUser,
  deleteCaseForUser,
} from "../services/case.service.js";
import { sendSuccess, sendError } from "../utils/response.js";

const statusEnum = z.enum(["OPEN", "IN_PROGRESS", "RESOLVED", "CLOSED"]);
const severityEnum = z.enum(["LOW", "MEDIUM", "HIGH", "CRITICAL"]);

const createSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  status: statusEnum.optional(),
  severity: severityEnum.optional(),
});

const updateSchema = z.object({
  title: z.string().min(1).optional(),
  description: z.string().optional(),
  status: statusEnum.optional(),
  severity: severityEnum.optional(),
});

export async function createCase(req: Request, res: Response): Promise<void> {
  if (!req.user) {
    sendError(res, "Unauthorized", 401);
    return;
  }

  const parsed = createSchema.safeParse(req.body);
  if (!parsed.success) {
    sendError(res, parsed.error.issues[0]?.message ?? "Invalid input", 422);
    return;
  }

  try {
    const result = await createCaseForUser(req.user.userId, parsed.data);
    sendSuccess(res, result, 201);
  } catch (err) {
    sendError(res, err instanceof Error ? err.message : "Failed to create case");
  }
}

export async function listCases(req: Request, res: Response): Promise<void> {
  if (!req.user) {
    sendError(res, "Unauthorized", 401);
    return;
  }

  try {
    const cases = await getCasesForUser(req.user.userId);
    sendSuccess(res, cases);
  } catch (err) {
    sendError(res, err instanceof Error ? err.message : "Failed to fetch cases");
  }
}

export async function getCase(req: Request, res: Response): Promise<void> {
  if (!req.user) {
    sendError(res, "Unauthorized", 401);
    return;
  }

  const { id } = req.params;
  if (!id) {
    sendError(res, "Missing case id", 400);
    return;
  }

  try {
    const result = await getCaseForUser(id, req.user.userId);
    sendSuccess(res, result);
  } catch (err) {
    sendError(res, err instanceof Error ? err.message : "Case not found", 404);
  }
}

export async function updateCase(req: Request, res: Response): Promise<void> {
  if (!req.user) {
    sendError(res, "Unauthorized", 401);
    return;
  }

  const { id } = req.params;
  if (!id) {
    sendError(res, "Missing case id", 400);
    return;
  }

  const parsed = updateSchema.safeParse(req.body);
  if (!parsed.success) {
    sendError(res, parsed.error.issues[0]?.message ?? "Invalid input", 422);
    return;
  }

  try {
    const result = await updateCaseForUser(id, req.user.userId, parsed.data);
    sendSuccess(res, result);
  } catch (err) {
    sendError(res, err instanceof Error ? err.message : "Case not found", 404);
  }
}

export async function deleteCase(req: Request, res: Response): Promise<void> {
  if (!req.user) {
    sendError(res, "Unauthorized", 401);
    return;
  }

  const { id } = req.params;
  if (!id) {
    sendError(res, "Missing case id", 400);
    return;
  }

  try {
    await deleteCaseForUser(id, req.user.userId);
    sendSuccess(res, null, 204);
  } catch (err) {
    sendError(res, err instanceof Error ? err.message : "Case not found", 404);
  }
}
