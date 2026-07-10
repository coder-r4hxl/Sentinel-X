import type { Request, Response } from "express";
import { runAnalysis, getAnalysis } from "../services/analysis.service.js";
import { sendSuccess, sendError } from "../utils/response.js";

export async function analyzeEvidence(req: Request, res: Response): Promise<void> {
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
    const result = await runAnalysis(id, req.user.userId);
    sendSuccess(res, result);
  } catch (err) {
    sendError(res, err instanceof Error ? err.message : "Analysis failed", 404);
  }
}

export async function getEvidenceAnalysis(req: Request, res: Response): Promise<void> {
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
    const result = await getAnalysis(id, req.user.userId);
    sendSuccess(res, result);
  } catch (err) {
    sendError(res, err instanceof Error ? err.message : "Analysis not found", 404);
  }
}
