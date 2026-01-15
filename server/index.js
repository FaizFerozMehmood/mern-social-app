
console.log("bissmillah.........!")

import express from "express";
import dotenv from "dotenv"
import cors from "cors"
import { connectdataBase } from "./config/connectDB.js";
import userRoutes from "./routes/userRoutes.js"
dotenv.config()

connectdataBase()

const app = express()
app.use(express.json())
app.use(cors({
    origin:"http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"]
}))
app.use(cors({
    origin:"*"
}))

// app.use("/",(req,res)=>{
//     res.send("Hello, its working")
// })

app.use("/",userRoutes)

app.listen(2000,()=>{
console.log(`server is running on 2000`)
})

