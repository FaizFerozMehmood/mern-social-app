import Post from "../models/postModel.js";

export const addCommentOnPost = async(req,res)=>{
    try {
        const {text} = req.body;
        const {postId} = req.params;
        console.log("postId=====",postId)
        const post = await Post.findById(postId)
        if(!post){
            return res.status(404).json({message:"Post not found..!"})
        }
        post.comments.push({
            text,
            userId:req.user.id
        })
        await post.save()
        res.status(201).json({
            message:"You commented on the post..!",
            post
        })
    } catch (error) {
        console.log("error commenting on the post..!",error.message)
       return res.status(500).json({message:"error commenting on the post..!",error:error.message})
    }
}