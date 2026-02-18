import dotenv from "dotenv"
dotenv.config()

console.log("bissmillah.........!")

import express from "express";
import cors from "cors"
import { connectdataBase } from "./config/connectDB.js";
import userRoutes from "./routes/userRoutes.js"
import postRoutes from "./routes/postRoute.js"
import comments from "./routes/commentRoute.js"
import uploadFile from "./routes/uploadFile.js"
import likeRoute from "./routes/likeroute.js"

connectdataBase()

const app = express()
app.use(express.json())
app.use(
  cors({
    // origin: "http://localhost:5173",
    origin: "mern-social-app-pfjf.vercel.app",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  }),
  // .........
);
app.use(cors({
    origin:"*"
}))



app.use("/",userRoutes)
app.use("/post",postRoutes)
app.use("/comments",comments)
app.use('/likes',likeRoute)
app.use("/upload",uploadFile)
app.use("/profile",uploadFile)


app.listen(2000,()=>{
console.log(`server is running on 2000`)
})

