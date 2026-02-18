import User from "../models/userModel.js";

export const toggleFollowUnfollow = async (req, res) => {
  try {
    const loggedInUserId = req.user.id;
    const profileUserId = req.params.userId;
    if (loggedInUserId === profileUserId) {
      return res.status(400).json({ message: "You cant follow yourself...!" });
    }
    const loggedInUser = await User.findById(loggedInUserId);
    const profileUser = await User.findById(profileUserId);
    if (!profileUser) {
      return res.status(404).json({ message: "user not found..!" });
    }
    const isFollowing = loggedInUser.following.some(
      (id) => id.toString() === profileUserId,
    );;
    if (isFollowing) {
      loggedInUser.following.pull(profileUserId);
      profileUser.followers.pull(loggedInUserId);
    } else {
      loggedInUser.following.push(profileUserId);
      profileUser.followers.push(loggedInUserId);
    }
    await loggedInUser.save();
    await profileUser.save();
    return res
      .status(200)
      .json({
        message: "followed..!",
        isFollowing: !isFollowing,
        count: profileUser.followers.length,
      });
  } catch (error) {
    console.log(error.message)
    res.status(500).json({ message: "follow process failed" });
  }
};
