
import React from 'react'
import {Route,Routes, useLocation} from "react-router-dom"
import Login from './components/pages/Login.jsx'
import Register from './components/pages/Register.jsx'
import Upload from './components/userDasboard/Upload.jsx'
import Post from './components/Post.jsx'
import ProtectedRoutes from './components/pages/routes/ProtectedRoute.jsx'
import PublicRotes from './components/pages/routes/PublicRoutes.jsx'
import UploadProfile from './components/userDasboard/UploadProfile.jsx'
import Navbar from './components/pages/Navbar.jsx'
import ActiveUsers from './components/userDasboard/ActiveUsers.jsx'
import { useState } from 'react'
import { useEffect } from 'react'
import UserPlusChat from "./components/userDasboard/UserPlusChat.jsx"
// .......................
function App() {
  const [token, setToken] = useState(null);
const [image, setProfileImage] = useState(localStorage.getItem("profileImage") || '');
const user = JSON.parse(localStorage.getItem('user'))
// ........
const location = useLocation()
  useEffect(() => {
    setToken(localStorage.getItem("token"));
     const img = localStorage.getItem("profileImage");
  setProfileImage(img || '');
   

  }, [location.pathname]);
  return (
    <>
      {token && <Navbar image={image}/>}
      <Routes>
        <Route
          path="/login"
          element={
            <PublicRotes>
              <Login />
            </PublicRotes>
          }
        />
        <Route path="/register" element={<Register />} />
        <Route
          path="/profile/:userId"
          element={
            <ProtectedRoutes>
              <UploadProfile />
            </ProtectedRoutes>
          }
        />
        <Route
          path="/upload"
          element={
            <ProtectedRoutes>
              <Upload />
            </ProtectedRoutes>
          }
        />
        <Route
          path="/"
          element={
            <ProtectedRoutes>
              <Post />
            </ProtectedRoutes>
          }
        />
        <Route
          path="users"
          element={
            <ProtectedRoutes>
              <ActiveUsers />
            </ProtectedRoutes>
          }
        />
        <Route
          path="/chats/:userId"
          element={
            <ProtectedRoutes>
              <UserPlusChat user={user} />
            </ProtectedRoutes>
          }
        />
        <Route
          path="/chats"
          element={
            <ProtectedRoutes>
              <UserPlusChat user={user} />
            </ProtectedRoutes>
          }
        />
      </Routes>
    </>
  );
}

export default App