
import express from "express";
import { createUser, getUser, getUsers, login, updateUserInfo } from "../controllers/userController.js";
import { authenticate } from "../authenticate.js";
import { toggleFollowUnfollow } from "../controllers/followController.js";

const router = express.Router()
router.post("/create",createUser)
router.post("/login",login)
router.put("/update/:id",updateUserInfo)
router.get('/user/:id',getUser)
router.get('/users',authenticate,getUsers)
router.post('/user/follow/:userId',authenticate,toggleFollowUnfollow)
router.get("/auth",authenticate,(req,res)=>{
    res.send("auth done..!")
})


export default router;
