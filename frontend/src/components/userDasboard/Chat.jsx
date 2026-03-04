import { useEffect, useState } from "react";
import socket from "../../socket";
import api from "../../api/axios";
import { UserOutlined } from "@ant-design/icons";

function Chat({ selectedUser }) {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");

  const loggedInUserId = localStorage.getItem("id");

  const getSenderId = (sender) =>
    typeof sender === "object" ? sender._id : sender;

  // Join socket room
  useEffect(() => {
    if (loggedInUserId) {
      socket.emit("join", loggedInUserId);
    }
  }, [loggedInUserId]);

  // Fetch old messages
  useEffect(() => {
    if (!selectedUser?._id) return;

    const fetchMessages = async () => {
      const token = localStorage.getItem("token");
      const res = await api.get(`/api/messages/${selectedUser._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessages(res.data);
    };

    fetchMessages();
  }, [selectedUser]);

  // Receive messages
  useEffect(() => {
    socket.on("receiveMessage", (msg) => {
      const senderId = getSenderId(msg.sender);
      if (senderId !== loggedInUserId) {
        setMessages((prev) => [...prev, msg]);
      }
    });

    return () => socket.off("receiveMessage");
  }, [loggedInUserId]);

  // Send message
  const sendMessage = async () => {
    if (!text.trim()) return;

    const token = localStorage.getItem("token");

    await api.post(
      "/api/messages",
      {
        receiver: selectedUser._id,
        content: text,
      },
      {
        headers: { Authorization: `Bearer ${token}` },
      },
    );

    socket.emit("sendMessage", {
      sender: loggedInUserId,
      receiver: selectedUser._id,
      content: text,
    });

    setMessages((prev) => [...prev, { sender: loggedInUserId, content: text }]);

    setText("");
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        background: "#e5ddd5",
        borderRadius: "10px",
      }}
    >
      {/* HEADER */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
          padding: "12px",
          background: "#075e54",
          color: "#fff",
          fontWeight: "bold",
        }}
      >
        {" "}
        {selectedUser?.profileImage? 
        <img
          src={selectedUser?.profileImage}
          alt=""
          style={{
            width: "40px",
            height: "40px",
            borderRadius: "50%",
            objectFit: "cover",
          }}
        />
        :<div
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
                        </div>}
        <span>{selectedUser?.userName}</span>
      </div>

      {/* MESSAGES */}
      <div
        style={{
          flex: 1,
          padding: "15px",
          overflowY: "auto",
        }}
      >
        {messages.map((msg, i) => {
          const isMe = getSenderId(msg.sender) === loggedInUserId;

          return (
            <div
              key={i}
              style={{
                display: "flex",
                justifyContent: isMe ? "flex-end" : "flex-start",
                marginBottom: "10px",
              }}
            >
              {!isMe && (
                <img
                  src={selectedUser?.profileImage}
                  alt=""
                  style={{
                    width: "30px",
                    height: "30px",
                    borderRadius: "50%",
                    marginRight: "6px",
                    objectFit: "cover",
                  }}
                />
              )}

              <div
                style={{
                  maxWidth: "60%",
                  background: isMe ? "#dcf8c6" : "#fff",
                  padding: "8px 12px",
                  borderRadius: "10px",
                  borderBottomRightRadius: isMe ? "0" : "10px",
                  borderBottomLeftRadius: !isMe ? "0" : "10px",
                }}
              >
                {!isMe && (
                  <div
                    style={{
                      fontSize: "11px",
                      fontWeight: "bold",
                      marginBottom: "2px",
                      color: "#555",
                    }}
                  >
                    {selectedUser?.userName?.split(" ")[0]}
                  </div>
                )}
                <div style={{ fontSize: "14px" }}>{msg.content}</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* INPUT */}
      <div
        style={{
          display: "flex",
          padding: "10px",
          background: "#f0f0f0",
        }}
      >
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type a message..."
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          style={{
            flex: 1,
            padding: "10px",
            borderRadius: "20px",
            border: "none",
            outline: "none",
          }}
        />
        <button
          onClick={sendMessage}
          style={{
            marginLeft: "10px",
            padding: "0 20px",
            borderRadius: "20px",
            border: "none",
            background: "#075e54",
            color: "#fff",
            cursor: "pointer",
          }}
        >
          Send
        </button>
      </div>
    </div>
  );
}

export default Chat;
