import Post from "../models/postModel.js";

export const LikePost = async (req, res) => {
  try {
    const postId = req.params.id;
    const userId = req.user.id;

    const post = await Post.findById(postId); 

    if (!post) {
      return res.status(404).json({ message: "Post not found!" });
    }

    const isLiked = post.likes.some(
      (id) => id.toString() === userId
    );

    if (isLiked) {
      post.likes = post.likes.filter(
        (id) => id.toString() !== userId
      );
    } else {
      post.likes.push(userId);
    }

    await post.save();

    res.status(200).json({
      success: true,
      message: isLiked ? "POST UNLIKED" : "POST LIKED",
      liked: !isLiked,
      count: post.likes.length,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
