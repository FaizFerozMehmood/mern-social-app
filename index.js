
console.log("bissmillah.........!")

import express from "express";
import dotenv from "dotenv"
import { connectdataBase } from "./config/connectDB.js";
import userRoutes from "./routes/userRoutes.js"
dotenv.config()

connectdataBase()

const app = express()
app.use(express.json())

// app.use("/",(req,res)=>{
//     res.send("Hello, its working")
// })

app.use("/",userRoutes)

app.listen(2000,()=>{
console.log(`server is running on 2000`)
})

