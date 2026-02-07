
import express from "express";
import { createUser, getUser, login, updateUserInfo } from "../controllers/userController.js";
import { authenticate } from "../authenticate.js";

const router = express.Router()
router.post("/create",createUser)
router.post("/login",login)
router.put("/update/:id",updateUserInfo)
router.get('/user/:id',getUser)
router.get("/auth",authenticate,(req,res)=>{
    res.send("auth done..!")
})

export default router;
