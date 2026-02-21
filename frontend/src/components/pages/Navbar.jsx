import React, { useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import {
  UserOutlined,
  HomeOutlined,
  TeamOutlined,
  LogoutOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import { Avatar, Modal, Upload } from "antd";
import { Button, Popconfirm } from "antd";
import FileUploader from "../userDasboard/Upload";

function Navbar({ getPosts }) {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const handleLogOut = () => {
    (localStorage.clear(), navigate("/login"));
  };
  const userId = localStorage.getItem("id");
  const location = useLocation();
  if (location.pathname === "/login" || location.pathname === "/register") {
    return null;
  }
  const navStyle = ({ isActive }) => ({
    color: isActive ? "#1877f2" : "#555",
    borderBottom: isActive ? "3px solid #1877f2" : "none",
    paddingBottom: "6px",
  });

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
              <HomeOutlined style={{ fontSize: "25px" }} />
            </NavLink>
          </li>
          <li onClick={() => setOpen(true)}>
            <UploadOutlined style={{ fontSize: 25, cursor: "pointer" ,paddingBottom:"6px"}} />
          </li>
          <li>
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
                <UserOutlined style={{ fontSize: "25px" }} />
              )}
            </NavLink>
          </li>

          <li>
            <NavLink to={"/users"} style={navStyle}>
              <TeamOutlined style={{ fontSize: "25px" }} />
            </NavLink>
          </li>

          <li>
            <Popconfirm
              title="Logout"
              description="Are you sure you want to logout?"
              onConfirm={handleLogOut}
              okText="Yes"
              cancelText="No"
            >
              <LogoutOutlined
                style={{ color: "red", fontSize: "25px", cursor: "pointer" }}
              />
            </Popconfirm>
          </li>
        </ul>
      </div>
      <Modal
        open={open}
        onCancel={() => setOpen(false)}
        footer={null}
        width={650}
        destroyOnClose
      >
        <FileUploader getPosts={getPosts} />
      </Modal>
    </div>
  );
}

export default Navbar;
