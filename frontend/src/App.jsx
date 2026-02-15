
import React from 'react'
import {Route,Routes} from "react-router-dom"
import Login from './components/pages/Login.jsx'
import Register from './components/pages/Register.jsx'
import Upload from './components/userDasboard/Upload.jsx'
import Post from './components/Post.jsx'
import ProtectedRoutes from './components/pages/routes/ProtectedRoute.jsx'
import PublicRotes from './components/pages/routes/PublicRoutes.jsx'
import UploadProfile from './components/userDasboard/UploadProfile.jsx'
import Navbar from './components/pages/Navbar.jsx'
import ActiveUsers from './components/userDasboard/ActiveUsers.jsx'

function App() {
  return (
    <>
    <Navbar/>
<Routes>
  
<Route path='/login' element={<PublicRotes>
  <Login/>
  </PublicRotes>}/>
<Route path='/register' element={<Register/>}/>
<Route path='/profile/:userId' element={<ProtectedRoutes>
  <UploadProfile/>
  </ProtectedRoutes>}/>
<Route path='/upload' element={<ProtectedRoutes>
  <Upload/>
</ProtectedRoutes>}/>
<Route path='/' element={<ProtectedRoutes>
  <Post/>
  </ProtectedRoutes>}/>
  <Route path='users' element={<ProtectedRoutes>
    <ActiveUsers/>
  </ProtectedRoutes>}/>

</Routes>
    </>
   
  )
}

export default App