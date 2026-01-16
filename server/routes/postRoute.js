

import express from 'express'
import { controlPost } from '../controllers/postController.js'
import { authenticate } from '../authenticate.js'

const router = express.Router()
router.post("/",authenticate,controlPost)

export default router