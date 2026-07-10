import { Router } from "express";
import {
  createEvidence,
  listEvidence,
  getEvidence,
  updateEvidence,
  deleteEvidence,
} from "../controllers/evidence.controller.js";
import { requireAuth } from "../middleware/auth.middleware.js";

// Nested under /api/cases/:caseId/evidence
const caseEvidenceRouter = Router({ mergeParams: true });
caseEvidenceRouter.use(requireAuth);
caseEvidenceRouter.post("/", createEvidence);
caseEvidenceRouter.get("/", listEvidence);

// Flat /api/evidence/:id routes
const evidenceRouter = Router();
evidenceRouter.use(requireAuth);
evidenceRouter.get("/:id", getEvidence);
evidenceRouter.patch("/:id", updateEvidence);
evidenceRouter.delete("/:id", deleteEvidence);

export { caseEvidenceRouter, evidenceRouter };
