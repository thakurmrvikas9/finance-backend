import express from "express";
import {
  getRecords,
  createRecord,
  getDashboardSummary,
} from "../controllers/financeController.js";
import { authenticate, authorize } from "../middleware/auth.js";

const router = express.Router();

// Summary: Analyst and Admin
router.get(
  "/summary",
  authenticate,
  authorize(["analyst", "admin"]),
  getDashboardSummary,
);

// View: All authenticated users
router.get("/", authenticate, getRecords);

// Manage: Admin only
router.post("/", authenticate, authorize(["admin"]), createRecord);

export default router;
