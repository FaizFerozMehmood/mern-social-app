import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { Avatar, Button } from "antd";
import api from "../../api/axios";

import {
  LikeOutlined,
  CommentOutlined,
  ShareAltOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import Loader from "../Loader";

function UploadProfile() {
  const [isError, setIsError] = useState(false);
  const navigate = useNavigate();
  const [isFollowing, setIsFollowing] = useState(false);
  const handleProfileNav = (userId) => {
    if (!userId) return;
    if (userId) {
      navigate(`/profile/${userId}`);
    }
  };
  const [showComments, setShowComments] = useState({});
  const [mycomment, setMycomment] = useState("");
  const fileInputRef = useRef(null);
  const [data, setData] = useState([]);

  const [isLoading, setIsLoading] = useState(false);
  const { userId } = useParams();
  console.log(userId);

  const [file, setFile] = useState(null);
  const [getuser, setGetUser] = useState({});
  const [followersCount, setFollowersCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);
  const handleCommentSubmit = async (postId) => {
    if (!mycomment.trim()) return;
    const token = localStorage.getItem("token");
    const response = await api.post(
      `/comments/${postId}/comment`,
      { text: mycomment },
      {
        headers: { Authorization: `Bearer ${token}` },
      },
    );
     setMycomment(""); 
     getUserPosts();  
    console.log(response, "comment response===>>");
    // getPosts()
  };
  const toggleComments = (postId) => {
    setShowComments((prev) => ({
      ...prev,
      [postId]: !prev[postId],
    }));
  };
  const handleLikeBtnn = async (postId) => {
    setData((prev) =>
      prev.map((post) =>
        post._id === postId
          ? {
              ...post,
              isLiked: !post.isLiked,
              likesCount: post.isLiked
                ? post.likesCount - 1
                : post.likesCount + 1,
            }
          : post,
      ),
    );

    try {
      const token = localStorage.getItem("token");
      const res = await api.get(`/likes/${postId}/like`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const { liked, count } = res.data;

      setData((prev) =>
        prev.map((post) =>
          post._id === postId
            ? { ...post, isLiked: liked, likesCount: count }
            : post,
        ),
      );
    } catch (err) {
      console.error(err);
      getUserPosts();
    }
  };

  const currentUserID = localStorage.getItem("id");
  const isOwner = currentUserID === userId;

  const getUserPosts = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await api.get(`/post/posts/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log(response.data.posts);
      setData(response?.data?.posts || []);
    } catch (error) {
      setIsError(true);
    }
  };

  const handleAvatarClick = () => {
    if (isOwner) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };
  console.log(data);
  const getUser = async () => {
    const response = await api.get(`/user/${userId}`);
 
    console.log(response.data.user.profileImage);
    const user = response.data?.user;
    console.log("user", response);
    console.log("followiers", user?.followers);
    setFollowingCount(user?.following?.length || 0);
    setGetUser(user);
    const isAlreadyFollowing =
      currentUserID &&
      user?.followers?.some((id) => id.toString() === currentUserID);
    setIsFollowing(!!isAlreadyFollowing);
    setFollowersCount(user?.followers?.length || 0);
  };

  useEffect(() => {
    if (!userId) return;
    setData([]);
    setGetUser({});
    setShowComments({});
    getUser();
    getUserPosts();
  }, [userId]);
  const handleProfile = async () => {
    if (!file) {
      return alert("No file selected!");
    }

    const formData = new FormData();
    formData.append("file", file);
    setIsLoading(true);
    const uploadRes = await api.post("/profile/upload", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    setIsLoading(false);

    const imageUri = uploadRes.data?.data;
    if (!imageUri) return alert("Image upload failed");

    await api.put(`/update/${currentUserID}`, {
      profileImage: imageUri,
    });

    getUser();
  };
  // useEffect(()=>{
  //   handleFollow();
  // },[])

  const handleFollow = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await api.post(
        `/user/follow/${userId}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      console.log("response get users", response.data);
      setIsFollowing(response.data.isFollowing);

      setFollowersCount(response.data.count);
      getUser();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      {isOwner ? (
        <>
          {/* ===== OWNER PROFILE ===== */}

          <div style={{ textAlign: "center", marginTop: 20 }}>
            <h6>
              <strong>
                {getuser.userName}
                {","}
              </strong>{" "}
              Welcome to your profile!
            </h6>
          </div>

          {/* Avatar */}
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              marginTop: 20,
            }}
          >
            {getuser?.profileImage ? (
              <div
                style={{
                  position: "relative",
                  width: 100,
                  height: 100,
                  cursor: "pointer",
                }}
                onClick={handleAvatarClick}
              >
                <img
                  src={getuser.profileImage}
                  alt="profile"
                  height={100}
                  width={100}
                  style={{
                    borderRadius: "50%",
                    objectFit: "cover",
                    width: "100%",
                    height: "100%",
                  }}
                />

                <span
                  style={{
                    position: "absolute",
                    bottom: 0,
                    right: 0,
                    transform: "translate(25%, 25%)",
                    backgroundColor: "#c522ba",
                    color: "#fff",
                    fontSize: "10px",
                    padding: "2px 6px",
                    borderRadius: "10px",
                    fontWeight: "500",
                  }}
                >
                  Update profile
                </span>
              </div>
            ) : (
              <div
                style={{
                  position: "relative",
                  width: 100,
                  height: 100,
                  cursor: "pointer",
                }}
                onClick={handleAvatarClick}
              >
                <Avatar
                  size={100}
                  style={{
                    backgroundColor: "#87d068",
                    width: "100%",
                    height: "100%",
                  }}
                >
                  {getuser?.userName?.charAt(0).toUpperCase() || "U"}
                </Avatar>

                <span
                  style={{
                    position: "absolute",
                    bottom: 0,
                    right: 0,
                    transform: "translate(25%, 25%)",
                    backgroundColor: "#22c55e",
                    color: "#fff",
                    fontSize: "10px",
                    padding: "2px 6px",
                    borderRadius: "10px",
                    fontWeight: "500",
                  }}
                >
                  Update profile
                </span>
              </div>
            )}
          </div>

          {/* Followers / Following */}
          <div style={{ textAlign: "center", marginTop: 12 }}>
            <p>
              <strong>{followersCount}</strong> Followers
            </p>
            <p>
              <strong>{followingCount}</strong> Following
            </p>
          </div>

          {/* Upload Button */}
          <div style={{ textAlign: "center", marginTop: 20, marginBottom: 20 }}>
            <Button onClick={handleProfile} disabled={!file}>
              {isLoading ? "Uploading..." : "Upload Profile"}
            </Button>
          </div>

          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            style={{ display: "none" }}
            accept="image/*"
          />
        </>
      ) : (
        <>
          <div style={{ textAlign: "center", marginTop: 40 }}>
            <h4>{getuser?.userName}'s Profile</h4>

            <img
              src={getuser?.profileImage}
              alt="profile"
              height={100}
              width={100}
              style={{
                borderRadius: "50%",
                objectFit: "cover",
                marginTop: 12,
              }}
            />

            <div style={{ marginTop: 16 }}>
              <button onClick={handleFollow}>
                {isFollowing ? "Unfollow" : "Follow"}
              </button>
            </div>

            <div style={{ marginTop: 12 }}>
              <p>
                <strong>{followersCount}</strong> Followers
              </p>
              <p>
                <strong>{followingCount}</strong> Following
              </p>
            </div>
          </div>
        </>
      )}

      {/* <p>{followingCount}</p> */}
      <div
        style={{
          backgroundColor: "#f0f2f5",
          minHeight: "100vh",
          padding: "20px 0",
        }}
      >
        <div style={{ maxWidth: "680px", margin: "0 auto" }}>
          {data.length > 0 ? (
            [...data].reverse().map((d) => (
              <div
                key={d._id}
                style={{
                  backgroundColor: "#fff",
                  borderRadius: "8px",
                  boxShadow: "0 1px 2px rgba(0, 0, 0, 0.2)",
                  marginBottom: "16px",
                  overflow: "hidden",
                }}
              >
                <div style={{ padding: "12px 16px" }}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "12px",
                      cursor: "pointer",
                    }}
                    // onClick={handleNavigateProfile}
                    onClick={() => handleProfileNav(d.userId?._id)}
                  >
                    {d.userId?.profileImage ? (
                      <img
                        src={d.userId.profileImage}
                        alt="creator"
                        height={40}
                        width={40}
                        style={{ borderRadius: "50%", objectFit: "cover" }}
                      />
                    ) : (
                      <Avatar
                        size={40}
                        style={{
                          backgroundColor: "#1877f2",
                          color: "#fff",
                          fontSize: "18px",
                        }}
                      >
                        {d.userId?.userName?.charAt(0).toUpperCase() || "U"}
                      </Avatar>
                    )}
                    <div style={{ flex: 1 }}>
                      <strong style={{ fontSize: "15px", color: "#050505" }}>
                        {d.userId?.userName}
                      </strong>
                      <div style={{ fontSize: "13px", color: "#65676b" }}>
                        {new Date(d.createdAt).toLocaleString("en-US", {
                          month: "short",
                          day: "numeric",
                          hour: "numeric",
                          minute: "2-digit",
                        })}
                      </div>
                    </div>
                  </div>
                </div>

                <div
                  style={{
                    padding: "0 16px 12px",
                    fontSize: "15px",
                    color: "#050505",
                    lineHeight: "1.3333",
                  }}
                >
                  {d.postMessage}
                </div>

                {d.selectedFile && (
                  <img
                    src={d.selectedFile}
                    alt="post"
                    style={{
                      width: "100%",
                      display: "block",
                      maxHeight: "600px",
                      objectFit: "cover",
                    }}
                  />
                )}

                <div
                  style={{
                    padding: "8px 16px",
                    borderBottom: "1px solid #e4e6eb",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <span style={{ fontSize: "15px", color: "#65676b" }}>
                    {d.likesCount} {d.likesCount === 1 ? "like" : "likes"}
                    {/* {d.likes.length} {d.likes.length === 1 ?"like":"likes"} */}
                  </span>
                  {d.comments.length >= 0 && (
                    <span
                      style={{
                        fontSize: "15px",
                        color: "#65676b",
                        cursor: "pointer",
                      }}
                      onClick={() => toggleComments(d._id)}
                    >
                      {d.comments.length}{" "}
                      {d.comments.length === 1 ? "comment" : "comments"}
                    </span>
                  )}
                </div>

                <div
                  style={{
                    display: "flex",
                    borderBottom: "1px solid #e4e6eb",
                    padding: "4px 16px",
                  }}
                >
                  <button
                    onClick={() => handleLikeBtnn(d._id)}
                    style={{
                      flex: 1,
                      padding: "8px",
                      border: "none",
                      background: "transparent",
                      cursor: "pointer",
                      fontSize: "15px",
                      fontWeight: "600",
                      color: d.isLiked ? "blue" : "#65676b",
                      borderRadius: "4px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "6px",
                    }}
                  >
                    <LikeOutlined
                      style={{
                        fontSize: "18px",
                        color: d.isLiked ? "blue" : "#65676b",
                      }}
                    />
                    Like
                  </button>
                  <button
                    onClick={() => toggleComments(d._id)}
                    // onClick={() => handleCommentSubmit(d._id)}

                    style={{
                      flex: 1,
                      padding: "8px",
                      border: "none",
                      background: "transparent",
                      cursor: "pointer",
                      fontSize: "15px",
                      fontWeight: "600",
                      color: "#65676b",
                      borderRadius: "4px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "6px",
                    }}
                  >
                    {/* <input type="text" onChange={(e)=> setMycomment(e.target.value)}/> */}
                    <CommentOutlined style={{ fontSize: "18px" }} />
                    Comment
                    {/* <button>Comment</button> */}
                  </button>
                  <button
                    style={{
                      flex: 1,
                      padding: "8px",
                      border: "none",
                      background: "transparent",
                      cursor: "pointer",
                      fontSize: "15px",
                      fontWeight: "600",
                      color: "#65676b",
                      borderRadius: "4px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "6px",
                    }}
                  >
                    <ShareAltOutlined style={{ fontSize: "18px" }} />
                    Share
                  </button>
                </div>

                <div
                  style={{
                    padding: "8px 16px",
                    display: "flex",
                    gap: "8px",
                    alignItems: "center",
                  }}
                >
                  <Avatar size={32} style={{ backgroundColor: "#87d068" }}>
                    U
                  </Avatar>
                  <div
                    style={{
                      flex: 1,
                      position: "relative",
                      display: "flex",
                      alignItems: "center",
                      backgroundColor: "#f0f2f5",
                      borderRadius: "20px",
                      padding: "4px 12px",
                    }}
                  >
                    <input
                      type="text"
                      placeholder="Write a comment..."
                      value={mycomment}
                      onChange={(e) => setMycomment(e.target.value)}
                      style={{
                        width: "100%",
                        border: "none",
                        background: "transparent",
                        outline: "none",
                        padding: "8px 0",
                        fontSize: "14px",
                      }}
                    />
                    <button
                      onClick={() => {
                        handleCommentSubmit(d._id);
                        setMycomment("");
                      }}
                      disabled={!mycomment.trim()}
                      style={{
                        border: "none",
                        background: "transparent",
                        color: mycomment.trim() ? "#1877f2" : "#bcc0c4",
                        fontWeight: "600",
                        cursor: mycomment.trim() ? "pointer" : "default",
                        padding: "0 8px",
                      }}
                    >
                      Post
                    </button>
                  </div>
                </div>

                {showComments[d._id] && d.comments.length > 0 && (
                  <div style={{ padding: "12px 16px" }}>
                    {[...d.comments].reverse().map((c) => (
                      <div
                        onClick={() => handleProfileNav(c.userId?._id)}
                        key={c._id}
                        style={{
                          display: "flex",
                          gap: "8px",
                          marginBottom: "12px",
                        }}
                      >
                        {c.userId?.profileImage ? (
                          <img
                            src={c.userId.profileImage}
                            alt="comment-user"
                            height={32}
                            width={32}
                            style={{
                              borderRadius: "50%",
                              objectFit: "cover",
                              cursor: "pointer",
                            }}
                          />
                        ) : (
                          <Avatar
                            size={32}
                            style={{
                              backgroundColor: "#e4e6eb",
                              color: "#65676b",
                              fontSize: "14px",
                              cursor: "pointer",
                            }}
                          >
                            {c.userId?.userName?.charAt(0).toUpperCase() || "A"}
                          </Avatar>
                        )}
                        <div style={{ flex: 1 }}>
                          <div
                            style={{
                              backgroundColor: "#f0f2f5",
                              borderRadius: "18px",
                              padding: "8px 12px",
                              display: "inline-block",
                            }}
                          >
                            <div
                              style={{
                                fontSize: "13px",
                                fontWeight: "600",
                                color: "#050505",
                              }}
                            >
                              {c.userId?.userName || "Anonymous"}
                            </div>
                            <div style={{ fontSize: "15px", color: "#050505" }}>
                              {c.text}
                            </div>
                          </div>
                          <div
                            style={{
                              fontSize: "12px",
                              color: "#65676b",
                              paddingLeft: "12px",
                              marginTop: "4px",
                            }}
                          >
                            {new Date(c.createdAt).toLocaleString("en-US", {
                              month: "short",
                              day: "numeric",
                              hour: "numeric",
                              minute: "2-digit",
                            })}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))
          ) : (
            <div>
              {isError ? (
                <div style={{ display: "flex", justifyContent: "center" }}>
                  <h5>No posts Yet..!</h5>
                </div>
              ) : (
                <Loader />
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default UploadProfile;
