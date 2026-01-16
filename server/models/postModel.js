
import mongoose from "mongoose";
const commentsSchema = new mongoose.Schema({
    text:String,
    userId:{
       type: mongoose.Schema.Types.ObjectId,
       ref:"User"
    },

},{timestamps:true})

const postSchema = new mongoose.Schema({
    postMessage:{
        type:String,
        default:""
    },
    selectedFile:{
        type:String,
        default:""
    },
    likeCount:{
        type:Number,
        default:0
    },
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    comments : [commentsSchema],
},{timestamps:true})

const Post = mongoose.model("Post",postSchema)

export default Post