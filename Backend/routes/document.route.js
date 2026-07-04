import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import auth from "../middleware/auth.js";
import role from "../middleware/role.js";
import {
  deleteDocument,
  getAllDocuments,
  getMyDocuments,
  uploadDocument,
} from "../controllers/document.controller.js";

const router = express.Router();
const uploadDir = path.join(process.cwd(), "uploads");
fs.mkdirSync(uploadDir, { recursive: true });
const upload = multer({ dest: uploadDir });

router.get("/me", auth, getMyDocuments);
router.post("/", auth, upload.single("file"), uploadDocument);
router.delete("/:id", auth, deleteDocument);
router.get("/", auth, role("Admin"), getAllDocuments);

export default router;
