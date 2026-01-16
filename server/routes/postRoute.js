

import express from 'express'
import { controlPost, getPosts } from '../controllers/postController.js'
import { authenticate } from '../authenticate.js'

const router = express.Router()


router.post("/",authenticate,controlPost)
router.get("/",authenticate,getPosts)

export default router