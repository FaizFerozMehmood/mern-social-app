
import express from "express";
import { createUser, login } from "../controllers/userController.js";
import { authenticate } from "../authenticate.js";

const router = express.Router()
router.post("/create",createUser)
router.post("/login",login)
router.get("/auth",authenticate,(req,res)=>{
    res.send("auth done..!")
})

export default router;
