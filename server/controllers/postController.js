import Post from "../models/postModel.js";

export const controlPost = async (req, res) => {
  try {
    const { postMessage, selectedFile } = req.body;
    console.log(req.body);
    const createPost = await new Post({
      postMessage,
      selectedFile,
      userId: req.user.id,
    });
    await createPost.save();
    return res.status(201).json({ message: "post Created...!", createPost });
  } catch (error) {
    console.log("error in post controller.....", error.message);
    return res
      .status(500)
      .json({ message: "error in post controller...", error: error.message });
  }
};
export const getPosts = async (req, res) => {
  try {
    const userId = req.user.id;
    const posts = await Post.find()
      .populate("userId", "userName profileImage")
      .populate("comments.userId", "userName profileImage")
    //   .populate("likes", "userName profileImage")
      .lean();
    const finalPosts = posts.map((post) => ({
      ...post,
      likesCount: post.likes.length,
      isLiked: post.likes.some((id) => id.toString() === userId),
    }));
    res.status(200).json({ success: true, posts: finalPosts });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getUserPost = async(req,res)=>{
  try {
    const {userId} = req.params;
    const posts = await Post.find({userId})
    if(!posts){
      return res.status(404).json({message:"post not found"})
    }
    if(posts.length===0){
      return res.status(404).json({message:"No posts found"})
    }
    return res.status(200).json({message:"Posts fetched",posts})
  } catch (error) {
     res.status(500).json({ message: error.message });
  }
}