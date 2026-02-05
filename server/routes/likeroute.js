
import express from "express";
import { LikePost } from "../controllers/likeController.js";
import { authenticate } from "../authenticate.js";


const router = express.Router()

router.get('/:id/like', authenticate,LikePost)

export default router;