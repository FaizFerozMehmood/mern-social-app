import express, { Router } from "express";
import { authenticate } from "../authenticate.js";
import { getMsg, sendMsg } from "../controllers/msgController.js";

const router = express.Router();

router.post("/", authenticate, sendMsg);

router.get("/:userId", authenticate, getMsg);

export default router;
