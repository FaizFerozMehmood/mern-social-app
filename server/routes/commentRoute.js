
import express from "express"
import { authenticate } from "../authenticate.js";
import { addCommentOnPost } from "../controllers/commentController.js";
const router = express.Router()



router.post("/:postId/comment",authenticate,addCommentOnPost)

export default router;
// http://localhost:2000/comments/6969c41a90b892299014b65b/comment