import { Router } from "express";
import { getSummary, getActivity } from "../controllers/dashboard.controller.js";
import { requireAuth } from "../middleware/auth.middleware.js";

const router = Router();

router.use(requireAuth);

router.get("/summary", getSummary);
router.get("/activity", getActivity);

export default router;
