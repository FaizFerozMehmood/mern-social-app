import { useState, useEffect } from "react";
import Chat from "./Chat";
import api from "../../api/axios";
import { UserOutlined, ArrowLeftOutlined } from "@ant-design/icons";

function UserPlusChat({ user }) {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const loggedInID = localStorage.getItem("id");

  // Detect screen resize
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Fetch users
  useEffect(() => {
    const token = localStorage.getItem("token");

    const getUsers = async () => {
      try {
        const res = await api.get("/users", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.status === 200) {
          setUsers(res.data?.data || []);
        }
      } catch (error) {
        console.log(error.message);
      }
    };

    getUsers();
  }, []);

  return (
    <div
      style={{
        display: "flex",
        height: "90vh",
        borderRadius: "10px",
        overflow: "hidden",
        background: "#f5f5f5",
      }}
    >
      {/* USERS LIST */}
      {(!isMobile || (isMobile && !selectedUser)) && (
        <div
          style={{
            width: isMobile ? "100%" : "30%",
            background: "#fff",
            borderRight: isMobile ? "none" : "1px solid #ddd",
            overflowY: "auto",
          }}
        >
          <div
            style={{
              padding: "15px",
              fontWeight: "bold",
              borderBottom: "1px solid #eee",
              background: "#075e54",
              color: "#fff",
            }}
          >
            Chats
          </div>

          {users.map((u) => {
            const isActive = selectedUser?._id === u._id;
            const isMe = loggedInID === u?._id;

            return (
              <div
                key={u._id}
                onClick={() => setSelectedUser(u)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  padding: "10px 15px",
                  cursor: "pointer",
                  background: isActive ? "#e6f2f0" : "transparent",
                  borderBottom: "1px solid #f0f0f0",
                }}
              >
                {u?.profileImage ? (
                  <img
                    src={u.profileImage}
                    alt=""
                    style={{
                      width: "45px",
                      height: "45px",
                      borderRadius: "50%",
                      objectFit: "cover",
                    }}
                  />
                ) : (
                  <div
                    style={{
                      width: "45px",
                      height: "45px",
                      borderRadius: "50%",
                      background: "#ddd",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <UserOutlined style={{ fontSize: "22px" }} />
                  </div>
                )}

                <div>
                  <p
                    style={{
                      margin: 0,
                      fontWeight: "bold",
                      fontSize: "14px",
                    }}
                  >
                    {isMe ? "ME" : u.userName}
                  </p>
                  <p
                    style={{
                      margin: 0,
                      fontSize: "12px",
                      color: "#777",
                    }}
                  >
                    Tap to chat...
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* CHAT SECTION */}
      {selectedUser && (
        <div
          style={{
            width: !isMobile ? "70%" : "100%",
            background: "#e5ddd5",
            position: "relative",
            transition: "0.3s",
          }}
        >
          {/* Back button on mobile */}
          {isMobile && (
            <button
              onClick={() => setSelectedUser(null)}
              style={{
                position: "absolute",
                top: "18px",
                left: "300px",
                // right:"250px",
                padding: "6px 10px",
                border: "none",
                borderRadius: "5px",
                background: "#075e54",
                color: "#fff",
                fontWeight: "bold",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "5px",
                zIndex: 10,
              }}
            >
              <ArrowLeftOutlined /> Back
            </button>
          )}
          <Chat user={user} selectedUser={selectedUser} />
        </div>
      )}

      {/* Default message for desktop */}
      {!isMobile && !selectedUser && (
        <div
          style={{
            width: "70%",
            background: "#e5ddd5",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#777",
            fontSize: "18px",
          }}
        >
          Select a user to start chat
        </div>
      )}
    </div>
  );
}

export default UserPlusChat;
