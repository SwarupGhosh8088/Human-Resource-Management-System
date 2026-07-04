import express from "express";
import auth from "../middleware/auth.js";
import role from "../middleware/role.js";
import {
  applyLeave,
  cancelLeave,
  getAllLeaves,
  getMyLeaves,
  updateLeaveStatus,
} from "../controllers/leave.controller.js";

const router = express.Router();

router.get("/me", auth, getMyLeaves);
router.post("/", auth, applyLeave);
router.delete("/:id", auth, cancelLeave);

router.get("/", auth, role("Admin"), getAllLeaves);
router.put("/:id/status", auth, role("Admin"), updateLeaveStatus);

export default router;
