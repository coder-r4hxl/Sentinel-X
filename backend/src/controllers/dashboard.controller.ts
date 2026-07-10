import type { Request, Response } from "express";
import {
  fetchDashboardSummary,
  fetchDashboardActivity,
} from "../services/dashboard.service.js";
import { sendSuccess, sendError } from "../utils/response.js";

export async function getSummary(req: Request, res: Response): Promise<void> {
  if (!req.user) {
    sendError(res, "Unauthorized", 401);
    return;
  }

  try {
    const data = await fetchDashboardSummary(req.user.userId);
    sendSuccess(res, data);
  } catch (err) {
    sendError(res, err instanceof Error ? err.message : "Failed to fetch summary", 500);
  }
}

export async function getActivity(req: Request, res: Response): Promise<void> {
  if (!req.user) {
    sendError(res, "Unauthorized", 401);
    return;
  }

  try {
    const data = await fetchDashboardActivity(req.user.userId);
    sendSuccess(res, data);
  } catch (err) {
    sendError(res, err instanceof Error ? err.message : "Failed to fetch activity", 500);
  }
}
