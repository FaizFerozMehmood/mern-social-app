import React, { useEffect, useState } from "react";
import api from "../api/axios";
import { Avatar, Modal } from "antd";
import { useNavigate } from "react-router-dom";
import {
  LikeOutlined,
  CommentOutlined,
  ShareAltOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { message } from "antd";
import Loader from "./Loader";
import Upload from "./userDasboard/Upload.jsx";
function Post() {
  const [open, setOpen] = useState(false);
  const [selectedLikes, setSelectedLikes] = useState([]);
  const [data, setData] = useState([]);
  const [showComments, setShowComments] = useState({});
  const [mycomment, setMycomment] = useState("");
  const [isloading, setIsLoading] = useState(false);
  const [isCommentLoading, setIsCommentLoading] = useState({});
  const [isError, setIsError] = useState(false);
  const navigate = useNavigate();
  const loggeduSER = localStorage.getItem("id");

  const handleProfileNav = (userId) => {
    if (!userId) return;
    if (userId) {
      navigate(`/profile/${userId}`);
    }
  };
  const getPosts = async () => {
    const token = localStorage.getItem("token");

    try {
      setIsLoading(true);
      setIsError(false);
      const response = await api.get("/post", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setData(response.data.posts);
      console.log("Posts==>", response.data);
      setIsLoading(false);
    } catch (error) {
      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        navigate("/login");
        return;
      } else {
        setIsError(true);
        // setIsLoading(false);
      }
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    getPosts();
  }, []);
  const handleCommentSubmit = async (postId) => {
    if (!mycomment.trim()) return;
    const token = localStorage.getItem("token");
    setIsCommentLoading((prev) => ({ ...prev, [postId]: true }));
    try {
      const response = await api.post(
        `/comments/${postId}/comment`,
        { text: mycomment },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      const updatedPost = response.data.post;

      console.log(response, "comment response===>>");
      setData((prev) =>
        prev.map((post) =>
          post._id === postId
            ? {
                ...updatedPost,

                isLiked: post.isLiked,
                likesCount: post.likesCount,
              }
            : post,
        ),
      );
      // alert('comment added')
      message.info("Comment Added..!");

      setMycomment("");
      // getPosts()
    } catch (error) {
      console.log("error", error.message);
    } finally {
      setIsCommentLoading((prev) => ({ ...prev, [postId]: false }));
    }
  };
  const toggleComments = (postId) => {
    setShowComments((prev) => ({
      ...prev,
      [postId]: !prev[postId],
    }));
  };
 const handleLikeBtnn = async (postId) => {
   const loggedUser = localStorage.getItem("id");

 
   setData((prev) =>
     prev.map((post) => {
       if (post._id !== postId) return post;

       const alreadyLiked = post.likes.some((u) => u._id === loggedUser);

       return {
         ...post,
         likes: alreadyLiked
           ? post.likes.filter((u) => u._id !== loggedUser)
           : [...post.likes, { _id: loggedUser }],
         likesCount: alreadyLiked ? post.likesCount - 1 : post.likesCount + 1,
       };
     }),
   );

   try {
     const token = localStorage.getItem("token");
     await api.get(`/likes/${postId}/like`, {
       headers: { Authorization: `Bearer ${token}` },
     });
   } catch (err) {
     console.error(err);
     getPosts(); // rollback
   }
 };

  return (
    <>
      <div
        style={{
          backgroundColor: "#f0f2f5",
          minHeight: "100vh",
          padding: "5px 0",
        }}
      >
        <div style={{ maxWidth: "680px", margin: "0 auto" }}>
          {isloading && <Loader />}
          {isError && (
            <div style={{ textAlign: "center", padding: "40px", color: "red" }}>
              Failed to load posts. Please try again.
            </div>
          )}
          {!isloading &&
            !isError &&
            [...data].reverse().map((d) => {
              const isPostLiked = d.likes?.some((u) => u._id === loggeduSER);
             
            return (
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
                {/* Post Header */}
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
                        {d.userId.userName?.charAt(0)?.toUpperCase() || "U"}
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

                {/* Post Content */}
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

                {/* Post Image */}
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

                {/* Like and Comment Count */}
                <div
                  style={{
                    padding: "8px 16px",
                    borderBottom: "1px solid #e4e6eb",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <div>
                    <span
                      onClick={() => {
                        setSelectedLikes(d.likes);
                        setOpen(true);
                      }}
                      style={{
                        fontSize: "15px",
                        color: "#65676b",
                        cursor: "pointer",
                      }}
                    >
                      {d.likesCount} {d.likesCount === 1 ? "like" : "likes"}
                    </span>
                    <Modal
                      open={open}
                      onCancel={() => setOpen(false)}
                      footer={null}
                      width={650}
                      destroyOnClose
                      title="Liked by"
                    >
                      {selectedLikes.length === 0 ? (
                        <p>NoOne</p>
                      ) : (
                        selectedLikes.map((data) => (
                          <div key={data._id}>
                            {data.profileImage ? (
                              <img
                                src={data.profileImage}
                                alt=""
                                height={20}
                                style={{
                                  width: "auto",
                                  objectFit: "contain",
                                  borderRadius: "25px",
                                }}
                              />
                            ) : (
                              <UserOutlined />
                            )}
                            <p>{data.userName}</p>
                          </div>
                        ))
                      )}
                    </Modal>
                  </div>

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

                {/* Action Buttons */}
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
                      // color: d.isLiked ? "blue" : "#65676b",
                      color: isPostLiked ? "blue" : "#65676b",
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
                        color: isPostLiked ? "blue" : "#65676b",
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
                  {/* <button
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
                  </button> */}
                </div>

                {/* Comment Input Section */}
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
                        setMycomment(""); // Clear input after clicking
                      }}
                      disabled={isCommentLoading[d._id] || !mycomment.trim()}
                      style={{
                        border: "none",
                        background: "transparent",
                        color: mycomment.trim() ? "#1877f2" : "#bcc0c4",
                        fontWeight: "600",
                        cursor: mycomment.trim() ? "pointer" : "default",
                        padding: "0 8px",
                      }}
                    >
                      {isCommentLoading[d._id] ? "Posting" : "post"}
                    </button>
                  </div>
                </div>

                {/* Comments Section */}
                {showComments[d._id] && d.comments.length > 0 && (
                  <div style={{ padding: "12px 16px" }}>
                    {/* {d.comments.map((c) => ( */}
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
            );
            }
            
             
            )}
        </div>
      </div>
    </>
  );
}

export default Post;
