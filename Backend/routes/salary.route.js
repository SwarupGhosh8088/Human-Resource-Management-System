import express from "express";
import auth from "../middleware/auth.js";
import role from "../middleware/role.js";
import {
  getAllSalaries,
  getMySalary,
  getSalaryByEmployee,
  updateSalary,
  upsertSalary,
} from "../controllers/salary.controller.js";

const router = express.Router();

router.get("/me", auth, getMySalary);

router.get("/", auth, role("Admin"), getAllSalaries);
router.get("/:employeeId", auth, role("Admin"), getSalaryByEmployee);
router.post("/", auth, role("Admin"), upsertSalary);
router.put("/:id", auth, role("Admin"), updateSalary);

export default router;
