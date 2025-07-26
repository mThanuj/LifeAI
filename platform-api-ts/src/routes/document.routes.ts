import express from "express";
import { uploadDocument } from "../controllers/document.controller";
import { isAuthenticated } from "../middlewares/auth.middleware";
import upload from "../config/multer.config";

const router = express.Router();

router.use(isAuthenticated);

router.post("/upload-document", upload.single("document"), uploadDocument);

export default router;
