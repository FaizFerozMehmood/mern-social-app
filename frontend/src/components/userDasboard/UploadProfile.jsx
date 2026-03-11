import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { Avatar, Button,Modal,Empty, Tooltip } from "antd";
import api from "../../api/axios";

import {
  LikeOutlined,
  CommentOutlined,
  ProfileOutlined, EnvironmentOutlined, BookOutlined,
  UserOutlined,
  FireTwoTone,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import Loader from "../Loader";

function UploadProfile() {
    const [open, setOpen] = useState(false);
    const [profileModelOpen, setProfileModeOpen] = useState(false)
    const [selectedLikes, setSelectedLikes] = useState([]);
  const [isError, setIsError] = useState(false);
  const navigate = useNavigate();
  const [isFollowing, setIsFollowing] = useState(false);
  
  const loggedInUserId = localStorage.getItem('id')
  const handleProfileNav = (userId) => {
    if (!userId) return;
    if (userId) {
      navigate(`/profile/${userId}`);
    }
  };
  const [followersList, setFollowersLists] = useState([])
  const [followingList, setFollowingLists] = useState([])
  const [showComments, setShowComments] = useState({});
  const [mycomment, setMycomment] = useState("");
  const fileInputRef = useRef(null);
  const [data, setData] = useState([]);
  const [coverCloudUrl, setCoverCloudUrl] = useState(null)
  const [bio,setBio] = useState('')
  const [city,setCity] = useState('')
  const [education,setEducation] = useState('')

  const [isLoading, setIsLoading] = useState(false);
  const { userId } = useParams();
  console.log(userId);

  const [file, setFile] = useState(null);
  const [coverUrl, setCoverUrl] = useState(null)
  const [getuser, setGetUser] = useState({});
  const [followersCount, setFollowersCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);
  const [isCurrentUserFollowing, setIsCurrentUserFollowing] = useState(false)
  
  
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
 
    console.log("imggggggggg",response.data.user.profileImage);
    if(response.data?.user?._id===loggedInUserId){
      localStorage.setItem("profileImage",response.data.user.profileImage);

    }
    const user = response.data?.user;
    console.log("current user", response);
    console.log("followiers", user?.followers);
    setFollowersLists(user?.followers)
    setFollowingLists(user?.following)
    const Is = user?.followers?.map(f=> f._id).includes(loggedInUserId)
    console.log("Is",Is)
    setIsCurrentUserFollowing(Is)
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
  const goToChat =(id)=>{
navigate(`/chats/${id}`)
  }
  const handleUserDataSubmision = async()=>{
    if(!bio || !coverCloudUrl || !city || !education) return alert("All fields are req..!")
    const data = {bio,coverImage:coverCloudUrl,city,education}
  
    console.log(data)
    try {
      const token = localStorage.getItem('token')
      const response = await api.put(`/enhance/${loggedInUserId}`,data,{
        headers: { Authorization: `Bearer ${token}` },
      })
      console.log(response,"reposne from user data form")
      setBio('');
      setEducation('');
      setCoverCloudUrl(null);
      setCity('')
      getUser()
      setProfileModeOpen(false)
    } catch (error) {
      console.log(error)
    }
  }
const handleCoverImage = (e)=>{
const file = e.target.files[0]
console.log("cover",file)
setCoverUrl(file)

}
const handleCoverUpload = async()=>{
  console.log("cover url to go=>",coverUrl)
   const formData = new FormData();
    formData.append("file", coverUrl);
  const response = await api.post('/profile/cover/upload',formData,{ headers: {
          "Content-Type": "multipart/form-data",
        },})
  console.log("cover api res",response.data?.data)
  setCoverCloudUrl(response.data?.data)
}

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
    <div >
     {isOwner ? (
  <>
    {/* ===== COVER IMAGE ===== */}
    <div
      style={{
        width: "100%",
        height: "220px",
        backgroundColor: "#e5e7eb",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {getuser?.coverImage && (
        <img
          src={getuser.coverImage}
          alt="cover"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />
      )}

      {/* Update profile button */}
      <div
        style={{
          position: "absolute",
          top: 20,
          right: 20,
        }}
      >
        <Button type="primary" onClick={() => setProfileModeOpen(true)}>
          Update Profile
        </Button>
      </div>
    </div>

    {/* ===== AVATAR ===== */}
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        marginTop: -50,
      }}
    >
      {getuser?.profileImage ? (
        <div
          style={{
            position: "relative",
            width: 110,
            height: 110,
            cursor: "pointer",
          }}
          onClick={handleAvatarClick}
        >
          <img
            src={getuser.profileImage}
            alt="profile"
            style={{
              borderRadius: "50%",
              objectFit: "cover",
              width: "100%",
              height: "100%",
              border: "4px solid white",
              boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
            }}
          />

          <span
            style={{
              position: "absolute",
              bottom: 0,
              right: 0,
              transform: "translate(25%,25%)",
              backgroundColor: "#1677ff",
              color: "#fff",
              fontSize: "10px",
              padding: "4px 8px",
              borderRadius: "12px",
            }}
          >
            Edit
          </span>
        </div>
      ) : (
        
        <Avatar
          size={110}
          style={{
            backgroundColor: "#1677ff",
            fontSize: 40,
            border: "4px solid white",
            cursor:"pointer"
          }}
          onClick={handleAvatarClick}
          title="EDIT"
        >
          {getuser?.userName?.charAt(0).toUpperCase()}
        </Avatar>
      )}
      
    </div>

    {/* ===== USER INFO ===== */}
    <div
      style={{
        textAlign: "center",
        marginTop: 15,
      }}
    >
      <h2 style={{ marginBottom: 5 }}>{getuser.userName}</h2>
      <p style={{ color: "#666" }}>Welcome to your profile</p>
    </div>

    {/* ===== BIO SECTION ===== */}
   <div
  style={{
    maxWidth: 500,
    margin: "20px auto",
    background: "#fff",
    padding: 20,
    borderRadius: 10,
    boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
  }}
>
  {getuser?.bio && (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        marginBottom: 10,
      }}
    >
      <ProfileOutlined style={{ fontSize: 18, color: "#555" }} />
      <span>{getuser.bio || "Bio not added..!"}</span>
    </div>
  )}

  {getuser?.city && (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        marginBottom: 10,
      }}
    >
      <EnvironmentOutlined style={{ fontSize: 18, color: "#555" }} />
      <span>{getuser.city || "City not added..!"}</span>
    </div>
  )}

  {getuser?.education && (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
      }}
    >
      <BookOutlined style={{ fontSize: 18, color: "#555" }} />
      <span>{getuser.education || "Education not added..!"}</span>
    </div>
  )}
</div>

   
    <div
  style={{
    display: "flex",
    justifyContent: "center",
    gap: 40,
    marginTop: 10,
    flexWrap: "wrap",
  }}
>
  {/* Followers */}
  <div style={{ textAlign: "center", minWidth: "140px" }}>
    <h3>{followersCount}</h3>
    <span style={{ color: "#666" }}>Followers</span>

    <div
      style={{
        display: "flex",
        justifyContent: "center",
        marginTop: 6,
      }}
    >
      {followersList?.slice(0, 5).map((f, i) => (
        <Tooltip key={f._id} title={f.userName}>
          <Avatar
            src={f.profileImage}
            size={24}
            icon={<UserOutlined />}
            style={{
              marginLeft: i === 0 ? 0 : -8,
              border: "2px solid white",
            }}
          />
        </Tooltip>
      ))}

      {followersCount > 5 && (
        <Avatar
          size={24}
          style={{
            marginLeft: -8,
            background: "#f0f0f0",
            color: "#555",
            fontSize: 12,
            border: "2px solid white",
          }}
        >
          +{followersCount - 5}
        </Avatar>
      )}
    </div>
  </div>

  {/* Following */}
  <div style={{ textAlign: "center", minWidth: "140px" }}>
    <h3>{followingCount}</h3>
    <span style={{ color: "#666" }}>Following</span>

    <div
      style={{
        display: "flex",
        justifyContent: "center",
        marginTop: 6,
      }}
    >
      {followingList?.slice(0, 5).map((f, i) => (
        <Tooltip key={f._id} title={f.userName}>
          <Avatar
            src={f.profileImage}
            size={24}
            icon={<UserOutlined />}
            style={{
              marginLeft: i === 0 ? 0 : -8,
              border: "2px solid white",
            }}
          />
        </Tooltip>
      ))}

      {followingCount > 5 && (
        <Avatar
          size={24}
          style={{
            marginLeft: -8,
            background: "#f0f0f0",
            color: "#555",
            fontSize: 12,
            border: "2px solid white",
          }}
        >
          +{followingCount - 5}
        </Avatar>
      )}
    </div>
  </div>
</div>

    {/* ===== PROFILE IMAGE UPLOAD ===== */}
    <div style={{ textAlign: "center", marginTop: 20,marginBottom:20 }}>
      <Button onClick={handleProfile} disabled={!file}>
        {isLoading ? "Uploading..." : "Upload Profile"}
      </Button>
      {/* <Button onClick={()=>goToChat(getuser?._id)}>Message</Button> */}
    </div>

    <input
      type="file"
      ref={fileInputRef}
      onChange={handleFileChange}
      style={{ display: "none" }}
      accept="image/*"
    />

    {/* ===== PROFILE UPDATE MODAL ===== */}
    <Modal
      open={profileModelOpen}
      onCancel={() => setProfileModeOpen(false)}
      footer={null}
      width={650}
      destroyOnClose
      title="Update your profile"
    >
      <input
        type="text"
        placeholder="Bio"
        onChange={(e) => setBio(e.target.value)}
        style={{ width: "100%", marginBottom: 10, padding: 8 }}
      />

      <input
        type="text"
        placeholder="City"
        onChange={(e) => setCity(e.target.value)}
        style={{ width: "100%", marginBottom: 10, padding: 8 }}
      />

      <input
        type="text"
        placeholder="Education"
        onChange={(e) => setEducation(e.target.value)}
        style={{ width: "100%", marginBottom: 10, padding: 8 }}
      />

      <input type="file" accept="image/*"
      
      onChange={handleCoverImage} />

      <div style={{ marginTop: 10 }}>
        <button onClick={handleCoverUpload}>Upload</button>
      </div>

      <Button
        type="primary"
        onClick={handleUserDataSubmision}
        style={{ marginTop: 15 }}
      >
        Submit
      </Button>
    </Modal>
  </>
) : (
 <>
  {/* ===== OTHER COVER IMAGE ===== */}
  <div
    style={{
      width: "100%",
      height: "220px",
      background: getuser?.coverImage
        ? "transparent"
        : "linear-gradient(135deg,#1677ff,#69c0ff)",
      position: "relative",
      overflow: "hidden",
    }}
  >
    {getuser?.coverImage && (
      <img
        src={getuser.coverImage}
        alt="cover"
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
        }}
      />
    )}
  </div>

 
  {/* ===== PROFILE IMAGE / AVATAR ===== */}
<div
  style={{
    display: "flex",
    justifyContent: "center",
    marginTop: -55,
    position: "relative",
    zIndex: 2
  }}
>
  {getuser?.profileImage ? (
    <img
      src={getuser.profileImage}
      alt="profile"
      style={{
        width: 110,
        height: 110,
        borderRadius: "50%",
        objectFit: "cover",
        border: "4px solid white",
        boxShadow: "0 4px 10px rgba(0,0,0,0.2)"
      }}
    />
  ) : (
    <Avatar
      size={110}
      style={{
        backgroundColor: "#1677ff",
        fontSize: 40,
        border: "4px solid white"
      }}
    >
      {getuser?.userName?.charAt(0).toUpperCase()}
    </Avatar>
  )}
</div>

  {/* ===== USER INFO ===== */}
  <div 
    style={{
      textAlign: "center",
      marginTop: 15,
    }}
  >
    <h2 style={{ marginBottom: 5 }}>{getuser?.userName}</h2>
  </div>

  {/* ===== BIO SECTION ===== */}
 <div
  style={{
    maxWidth: 500,
    margin: "20px auto",
    background: "#fff",
    padding: 20,
    borderRadius: 10,
    boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
  }}
>
  {getuser?.bio && (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        marginBottom: 10,
      }}
    >
      <ProfileOutlined style={{ fontSize: 18, color: "#555" }} />
      <span>{getuser.bio || "Bio not added..!"}</span>
    </div>
  )}

  {getuser?.city && (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        marginBottom: 10,
      }}
    >
      <EnvironmentOutlined style={{ fontSize: 18, color: "#555" }} />
      <span>{getuser.city || "City not added..!"}</span>
    </div>
  )}

  {getuser?.education && (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
      }}
    >
      <BookOutlined style={{ fontSize: 18, color: "#555" }} />
      <span>{getuser.education || "Education not added..!"}</span>
    </div>
  )}
</div>
  {/* ===== FOLLOW BUTTON ===== */}
  <div style={{ textAlign: "center", marginTop: 10, }}>
    <Button  type="primary" onClick={handleFollow}>
      {isCurrentUserFollowing ? "Unfollow" : "Follow"}
    </Button>
    
    <Button color="pink" variant="solid" onClick={()=>goToChat(getuser?._id)}>Message</Button>
  </div>

  {/* ===== FOLLOWERS ===== */}
  <div
  style={{
    display: "flex",
    justifyContent: "center",
    gap: 40,
    marginTop: 10,
    flexWrap: "wrap",
  }}
>
  {/* Followers */}
  <div style={{ textAlign: "center", minWidth: "140px" }}>
    <h3>{followersCount}</h3>
    <span style={{ color: "#666" }}>Followers</span>

    <div
      style={{
        display: "flex",
        justifyContent: "center",
        marginTop: 6,
      }}
    >
      {followersList?.slice(0, 5).map((f, i) => (
        <Tooltip key={f._id} title={f.userName}>
          <Avatar
            src={f.profileImage}
            size={24}
            icon={<UserOutlined />}
            style={{
              marginLeft: i === 0 ? 0 : -8,
              border: "2px solid white",
            }}
          />
        </Tooltip>
      ))}

      {followersCount > 5 && (
        <Avatar
          size={24}
          style={{
            marginLeft: -8,
            background: "#f0f0f0",
            color: "#555",
            fontSize: 12,
            border: "2px solid white",
          }}
        >
          +{followersCount - 5}
        </Avatar>
      )}
    </div>
  </div>

  {/* Following */}
  <div style={{ textAlign: "center", minWidth: "140px" }}>
    <h3>{followingCount}</h3>
    <span style={{ color: "#666" }}>Following</span>

    <div
      style={{
        display: "flex",
        justifyContent: "center",
        marginTop: 6,
      }}
    >
      {followingList?.slice(0, 5).map((f, i) => (
        <Tooltip key={f._id} title={f.userName}>
          <Avatar
            src={f.profileImage}
            size={24}
            icon={<UserOutlined />}
            style={{
              marginLeft: i === 0 ? 0 : -8,
              border: "2px solid white",
            }}
          />
        </Tooltip>
      ))}

      {followingCount > 5 && (
        <Avatar
          size={24}
          style={{
            marginLeft: -8,
            background: "#f0f0f0",
            color: "#555",
            fontSize: 12,
            border: "2px solid white",
          }}
        >
          +{followingCount - 5}
        </Avatar>
      )}
    </div>
  </div>
</div>
</>
)}
      
      <div
        style={{
          backgroundColor: "#f0f2f5",
          minHeight: "100vh",
          padding: "20px 0",
        }}
      >
        <div style={{ maxWidth: "680px", margin: "0 auto" }}>
          {data.length > 0 ? (
            [...data].reverse().map((d) => { 
              const isPostLiked = d.likes?.some(
                (u) => u._id === loggedInUserId,
              );
              return(
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
                                <UserOutlined/>
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

              )
})
          ) : (
            <div>
              {isError ? (
                <div style={{ display: "flex", justifyContent: "center" }}>
                  <Empty/>
                </div>
              ) : (
                <Loader />
              )}
            </div>
          )}
        </div>
      </div>
      <Modal
        open={open}
        onCancel={() => setOpen(false)}
        footer={null}
        width={650}
        destroyOnClose
      >
        {/* <FileUploader getPosts={getPosts} /> */}
      </Modal>
    </div>
  );
}

export default UploadProfile;
