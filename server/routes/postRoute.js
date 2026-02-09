

import express from 'express'
import { controlPost, getPosts, getUserPost } from '../controllers/postController.js'
import { authenticate } from '../authenticate.js'

const router = express.Router()


router.post("/",authenticate,controlPost)
router.get("/",authenticate,getPosts)
router.get('/posts/:userId',authenticate,getUserPost)

export default router