import { useState, useEffect } from "react";
import Chat from "./Chat";
import api from "../../api/axios";
import { UserOutlined } from "@ant-design/icons";
import { useParams, useNavigate } from "react-router-dom";

function UserPlusChat({ user }) {

  // Store all users for sidebar
  const [users, setUsers] = useState([]);

  // Currently selected chat user
  const [selectedUser, setSelectedUser] = useState(null);

  // Detect mobile screen
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  // Logged-in user id
  const loggedInID = localStorage.getItem("id");

  // URL parameter ( /chats/:userId )
  const { userId } = useParams();

  // Navigation
  const navigate = useNavigate();



  /* --------------------------------------------------
     1️⃣ Detect screen resize (mobile vs desktop)
  -------------------------------------------------- */
  useEffect(() => {

    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);

  }, []);



  /* --------------------------------------------------
     2️⃣ Fetch all users for chat list
  -------------------------------------------------- */
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



  /* --------------------------------------------------
     3️⃣ Handle chat opening from URL
     Example:
     /chats        → no user selected
     /chats/123    → open chat with user 123
  -------------------------------------------------- */
  useEffect(() => {

    if (!users.length) return;

    if (userId) {

      const foundUser = users.find((u) => u._id === userId);

      if (foundUser) {
        setSelectedUser(foundUser);
      }

    } else {
      setSelectedUser(null);
    }

  }, [userId, users]);



  /* --------------------------------------------------
     4️⃣ When clicking a user from sidebar
     - set state
     - update URL
  -------------------------------------------------- */
  const openChat = (u) => {

    setSelectedUser(u);

    // Update URL
    navigate(`/chats/${u._id}`);

  };



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

      {/* =================================================
         USERS LIST SIDEBAR
      ================================================= */}
      {(!isMobile || (isMobile && !selectedUser)) && (

        <div
          style={{
            width: isMobile ? "100%" : "30%",
            background: "#fff",
            borderRight: isMobile ? "none" : "1px solid #ddd",
            overflowY: "auto",
          }}
        >

          {/* Sidebar header */}
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


          {/* Users list */}
          {users.map((u) => {

            const isActive = selectedUser?._id === u._id;
            const isMe = loggedInID === u._id;

            return (
              <div
                key={u._id}
                onClick={() => openChat(u)}
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

                {/* Avatar */}
                {u.profileImage ? (

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

                {/* Username */}
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



      {/* =================================================
         CHAT SECTION
      ================================================= */}
      {selectedUser && (

        <div
          style={{
            width: !isMobile ? "70%" : "100%",
            background: "#e5ddd5",
            position: "relative",
          }}
        >

          {/* Mobile back button */}
          {isMobile && (

            <button
              onClick={() => {
                setSelectedUser(null);
                navigate("/chats");
              }}
              style={{
                position: "absolute",
                top: "18px",
                left: "290px",
                padding: "6px 10px",
                border: "none",
                borderRadius: "5px",
                background: "#84b7b2",
                color: "#fff",
                fontWeight: "bold",
                cursor: "pointer",
                zIndex: 10,
              }}
            >
              {"<=Back"}
            </button>

          )}

          <Chat user={user} selectedUser={selectedUser} />

        </div>

      )}



      {/* =================================================
         DESKTOP EMPTY STATE
      ================================================= */}
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
          Select a user to start chat...!
        </div>

      )}

    </div>
  );
}

export default UserPlusChat;