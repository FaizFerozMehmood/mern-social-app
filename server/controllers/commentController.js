import Post from "../models/postModel.js";

export const addCommentOnPost = async(req,res)=>{
    try {
        const {text} = req.body;
        const userId= req.user.id
        console.log(userId,"------------> userid")
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
        const populatedPost = await Post.findById(post._id)
        .populate("userId", "userName profileImage")
        .populate("comments.userId", "userName profileImage");
        res.status(201).json({
            message:"You commented on the post..!",
            post : populatedPost
        })
    } catch (error) {
        console.log("error commenting on the post..!",error.message)
       return res.status(500).json({message:"error commenting on the post..!",error:error.message})
    }
}