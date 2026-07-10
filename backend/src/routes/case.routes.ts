import { Router } from "express";
import {
  createCase,
  listCases,
  getCase,
  updateCase,
  deleteCase,
} from "../controllers/case.controller.js";
import { requireAuth } from "../middleware/auth.middleware.js";
import { caseEvidenceRouter } from "./evidence.routes.js";

const router = Router();

router.use(requireAuth);

router.post("/", createCase);
router.get("/", listCases);
router.get("/:id", getCase);
router.patch("/:id", updateCase);
router.delete("/:id", deleteCase);

router.use("/:caseId/evidence", caseEvidenceRouter);

export default router;
