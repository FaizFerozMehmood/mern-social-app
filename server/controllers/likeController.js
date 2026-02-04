import Post from "../models/postModel.js";

export const LikePost = async (req, res) => {
  try {
    const postId = req.params.id;
    const userId = req.user.id;
    console.log(userId);
     const post = await Post.findById(postId);
  if (!post) {
    return res.status(404).json({ message: "Post not found!" });
  }
  const isLiked = post.likes.includes(userId);
  if (isLiked) {
     post.likes = post.likes.filter(
  (id) => id.toString() !== userId
);;
  } else {
    post.likes.push(userId);
  }
  await post.save();
  res
    .status(200)
    .json({
      message: "YOU LIKED THE POST",
      success: true,
      count: post.likes.length,
      liked: !isLiked,
    });
  } catch (error) {
    res.status(500).json({message:error.message})
  }
 
};
