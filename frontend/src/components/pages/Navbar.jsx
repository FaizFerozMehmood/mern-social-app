import React from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import {
  UserOutlined,
  HomeOutlined,
  TeamOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import { Avatar } from "antd";

function Navbar() {
  const userId = localStorage.getItem("id");
  const navigate = useNavigate();
  const location = useLocation();
  if (location.pathname === "/login" || location.pathname === "/register") {
    return null;
  }
const navStyle = ({ isActive }) => ({
  color: isActive ? "#1877f2" : "#555",
  borderBottom: isActive ? "3px solid #1877f2" : "none",
  paddingBottom: "6px",
});
  const handleLogOut = () => {
    localStorage.clear();
    navigate("/login");
  };
  const profileImage = localStorage.getItem("profileImage");
  return (
    <div
      style={{
        position: "sticky",
        top: 0,
        zIndex: 1000,
        backgroundColor: "#fff",
        boxShadow: "0 2px 6px rgba(0, 0, 0, 0.08)",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "10px 20px",
        }}
      >
        <p style={{ fontWeight: "bold" }}>Facebook</p>

        <ul
          style={{
            display: "flex",
            gap: "20px",
            listStyle: "none",
            margin: 0,
            padding: 0,
            cursor: "pointer",
          }}
        >
          <li>
            <NavLink to={"/"} style={navStyle}>
              <HomeOutlined style={{ fontSize: "30px" }} />
            </NavLink>
          </li>
          <NavLink to={`/profile/${userId}`} style={navStyle}>
            {profileImage ? (
              <Avatar
                src={profileImage || undefined}
                // size={30}
                style={{
                  backgroundColor: "#1877f2",
                  border: "1px solid blue",
                }}
              ></Avatar>
            ) : (
              <UserOutlined style={{ fontSize: "30px" }} />
            )}
          </NavLink>

          <li>
            <NavLink to={"/users"} style={navStyle}>
              <TeamOutlined style={{ fontSize: "30px" }} />
            </NavLink>
          </li>
          <li onClick={handleLogOut}>
            {" "}
            <LogoutOutlined style={{ color: "red", fontSize: "30px" }} />
          </li>
        </ul>
      </div>
    </div>
  );
}

export default Navbar;
