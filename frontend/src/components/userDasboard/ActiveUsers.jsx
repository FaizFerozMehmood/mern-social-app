import React, { useEffect, useState } from "react";
import api from "../../api/axios";
import { Avatar, Button } from "antd";
import { AntDesignOutlined, UserOutlined } from "@ant-design/icons";

import { useNavigate, useParams } from "react-router-dom";
function ActiveUsers() {
  const loggedIn = localStorage.getItem("id");
  const [userdata, setUserData] = useState([]);
  const navigate = useNavigate();
  const [userName, setUserName] = useState("");

  useEffect(() => {
    if (!userName.trim()) {
      getUSERS();
      return;
    }
    const timer = setTimeout(() => {
      searchUsers();
    }, 500);
    return () => clearTimeout(timer);
  }, [userName]);
  const searchUsers = async () => {
    try {
      const response = await api.get(
        `/search?userName=${encodeURIComponent(userName)}`,
      );
      console.log("response", response.data?.data);
      setUserData(response.data?.data);
    } catch (error) {
      console.log(error);
    }
  };

  const token = localStorage.getItem("token");
  const getUSERS = async () => {
    try {
      const response = await api.get("/users", {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log(response.data.data);
      console.log(response.data.data.followers);
      console.log(response.status);
      if (response.status === 200) {
        setUserData(response.data?.data);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    getUSERS();
  }, []);

  const handleFollow = async (userId) => {
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
      // setIsFollowing(response.data.isFollowing);

      //   setFollowersCount(response.data.count);
      getUSERS();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          marginTop: "20px",
        }}
      >
        <input
          style={{
            height: "38px",
            width: "300px",
            padding: "0 12px",
            border: "2px solid blue",
            borderRadius:"6px",
            outline:"none",
            fontSize:"14px"
          }}
          value={userName}
          type="text"
          placeholder="Search user"
          onChange={(e) => setUserName(e.target.value)}
        />
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          flexWrap: "wrap",
          gap: "40px",
          marginTop: "20px",
        }}
      >
        {userdata.length > 0 ? (
          [...userdata]
            .reverse()
            .filter((user) => user._id !== loggedIn)
            .map((user) => (
              <div key={user._id}>
                <div
                  style={{
                    width: 260,
                    padding: "24px 16px",
                    textAlign: "center",
                    borderRadius: 12,
                    background: "#fff",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                  }}
                >
                  {user.profileImage ? (
                    <img
                      src={user?.profileImage}
                      alt="profile"
                      height={100}
                      width={100}
                      style={{
                        borderRadius: "50%",
                        objectFit: "cover",
                        marginTop: 12,
                      }}
                    />
                  ) : (
                    <UserOutlined
                      style={{
                        fontSize: "72px",
                        color: "#1877f2",
                        background: "#e7f3ff",
                        padding: "10px",
                        borderRadius: "50%",
                      }}
                    />
                  )}
                  <h4 style={{ marginTop: 12 }}>{user.userName}</h4>

                  <div
                    style={{
                      display: "flex",
                      marginTop: "20px",
                      gap: "12px",
                      justifyContent: "center",
                    }}
                  >
                    {/* <button onClick={() => handleFollow(user._id)}>
                    {user.isFollowing ? "Unfollow" : "Follow"}
                  </button> */}
                    <Button
                      onClick={() => handleFollow(user._id)}
                      type="primary"
                      size="large"
                    >
                      {user.isFollowing ? "Unfollow" : "Follow"}
                    </Button>
                    <Button
                      onClick={() => navigate(`/profile/${user._id}`)}
                      color="default"
                      variant="solid"
                      size="large"
                    >
                      Visit Profile
                    </Button>
                  </div>

                  <div
                    style={{
                      marginTop: 12,
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      gap: "20px",
                      flexWrap: "wrap",
                    }}
                  >
                    <p>
                      <strong>{user.followers?.length ?? 0}</strong>
                      <span style={{ marginLeft: 4, color: "#65676b" }}>
                        Followers
                      </span>
                    </p>
                    <p>
                      <strong>{user.following?.length ?? 0}</strong>
                      <span style={{ marginLeft: 4, color: "#65676b" }}>
                        Following
                      </span>
                    </p>
                    <p style={{ fontSize: "14px", color: "#092f7a" }}>
                      Joined{" "}
                      {user.createdAt
                        ? new Date(user.createdAt).toLocaleString("en-GB", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })
                        : "—"}
                    </p>
                  </div>
                </div>
              </div>
            ))
        ) : (
          <div>
            <h4 style={{ color: "red" }}>Nothing to see, Boss!</h4>
          </div>
        )}
      </div>
    </>
  );
}

export default ActiveUsers;
