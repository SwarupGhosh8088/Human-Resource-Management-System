import express from "express";
import auth from "../middleware/auth.js";
import role from "../middleware/role.js";
import {
  checkIn,
  checkOut,
  getAllAttendance,
  getMyAttendance,
  markAttendance,
  updateAttendance,
} from "../controllers/attendance.controller.js";

const router = express.Router();

router.get("/me", auth, getMyAttendance);
router.post("/checkin", auth, checkIn);
router.post("/checkout", auth, checkOut);

router.get("/", auth, role("Admin"), getAllAttendance);
router.post("/", auth, role("Admin"), markAttendance);
router.put("/:id", auth, role("Admin"), updateAttendance);

export default router;
