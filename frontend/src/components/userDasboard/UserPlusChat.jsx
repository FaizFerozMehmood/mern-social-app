import { useState, useEffect } from "react";
import Chat from "./Chat";
import api from "../../api/axios";
import { UserOutlined } from "@ant-design/icons";

function UserPlusChat({ user }) {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const logggedInID = localStorage.getItem('id')

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
  
  console.log(users);
  return (
    <div
      style={{
        display: "flex",
        height: "90vh",
        background: "#f5f5f5",
        borderRadius: "10px",
        overflow: "hidden",
      }}
    >
      {/* USERS LIST */}
      <div
        style={{
          width: "30%",
          background: "#fff",
          borderRight: "1px solid #ddd",
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
          const IsU = logggedInID===u?._id
          console.log(IsU)

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
                  {IsU ? "ME" : u.userName}
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

      {/* CHAT SECTION */}
      <div
        style={{
          width: "70%",
          background: "#e5ddd5",
        }}
      >
        {selectedUser ? (
          <Chat user={user} selectedUser={selectedUser} />
        ) : (
          <div
            style={{
              height: "100%",
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
    </div>
  );
}

export default UserPlusChat;
