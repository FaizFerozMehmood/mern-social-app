
import express from "express";
import multer from "multer";
import { uploadFileController } from "../controllers/uploadController.js";
import os from "os";
// import dotenv from "dotenv"
// dotenv.config()
// import { uploadFileController } from "../controllers/uploadController.js";

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, os.tmpdir());
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

router.post("/upload", upload.single("file"), uploadFileController);

export default router;