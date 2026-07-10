import type { Request, Response } from "express";
import { z } from "zod";
import {
  createEvidenceForCase,
  getEvidenceForCase,
  getEvidenceById,
  updateEvidenceById,
  deleteEvidenceById,
} from "../services/evidence.service.js";
import { sendSuccess, sendError } from "../utils/response.js";

const createSchema = z.object({
  label: z.string().min(1),
  description: z.string().optional(),
  fileName: z.string().optional(),
  filePath: z.string().optional(),
  mimeType: z.string().optional(),
  fileSize: z.number().int().nonnegative().optional(),
});

const updateSchema = z.object({
  label: z.string().min(1).optional(),
  description: z.string().optional(),
  fileName: z.string().optional(),
  filePath: z.string().optional(),
  mimeType: z.string().optional(),
  fileSize: z.number().int().nonnegative().optional(),
});

export async function createEvidence(req: Request, res: Response): Promise<void> {
  if (!req.user) {
    sendError(res, "Unauthorized", 401);
    return;
  }

  const { caseId } = req.params;
  if (!caseId) {
    sendError(res, "Missing caseId", 400);
    return;
  }

  const parsed = createSchema.safeParse(req.body);
  if (!parsed.success) {
    sendError(res, parsed.error.issues[0]?.message ?? "Invalid input", 422);
    return;
  }

  try {
    const result = await createEvidenceForCase(caseId, req.user.userId, parsed.data);
    sendSuccess(res, result, 201);
  } catch (err) {
    sendError(res, err instanceof Error ? err.message : "Failed to create evidence", 404);
  }
}

export async function listEvidence(req: Request, res: Response): Promise<void> {
  if (!req.user) {
    sendError(res, "Unauthorized", 401);
    return;
  }

  const { caseId } = req.params;
  if (!caseId) {
    sendError(res, "Missing caseId", 400);
    return;
  }

  try {
    const result = await getEvidenceForCase(caseId, req.user.userId);
    sendSuccess(res, result);
  } catch (err) {
    sendError(res, err instanceof Error ? err.message : "Failed to fetch evidence", 404);
  }
}

export async function getEvidence(req: Request, res: Response): Promise<void> {
  if (!req.user) {
    sendError(res, "Unauthorized", 401);
    return;
  }

  const { id } = req.params;
  if (!id) {
    sendError(res, "Missing evidence id", 400);
    return;
  }

  try {
    const result = await getEvidenceById(id, req.user.userId);
    sendSuccess(res, result);
  } catch (err) {
    sendError(res, err instanceof Error ? err.message : "Evidence not found", 404);
  }
}

export async function updateEvidence(req: Request, res: Response): Promise<void> {
  if (!req.user) {
    sendError(res, "Unauthorized", 401);
    return;
  }

  const { id } = req.params;
  if (!id) {
    sendError(res, "Missing evidence id", 400);
    return;
  }

  const parsed = updateSchema.safeParse(req.body);
  if (!parsed.success) {
    sendError(res, parsed.error.issues[0]?.message ?? "Invalid input", 422);
    return;
  }

  try {
    const result = await updateEvidenceById(id, req.user.userId, parsed.data);
    sendSuccess(res, result);
  } catch (err) {
    sendError(res, err instanceof Error ? err.message : "Evidence not found", 404);
  }
}

export async function deleteEvidence(req: Request, res: Response): Promise<void> {
  if (!req.user) {
    sendError(res, "Unauthorized", 401);
    return;
  }

  const { id } = req.params;
  if (!id) {
    sendError(res, "Missing evidence id", 400);
    return;
  }

  try {
    await deleteEvidenceById(id, req.user.userId);
    sendSuccess(res, null, 204);
  } catch (err) {
    sendError(res, err instanceof Error ? err.message : "Evidence not found", 404);
  }
}
