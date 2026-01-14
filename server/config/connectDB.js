
import mongoose from "mongoose";

export const connectdataBase = async()=>{
try {
    const con = await mongoose.connect(process.env.MONGO_URI)
console.log("connected ===>",con.connection.host)
    
} catch (error) {
    console.log("disconnected..!")
}    
}