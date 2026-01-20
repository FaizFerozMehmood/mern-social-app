
import React from 'react'
import {Route,Routes} from "react-router-dom"
import Login from './components/pages/Login.jsx'
import Register from './components/pages/Register.jsx'
import Upload from './components/userDasboard/Upload.jsx'
import Post from './components/Post.jsx'
import ProtectedRoutes from './components/pages/routes/ProtectedRoute.jsx'
import PublicRotes from './components/pages/routes/PublicRoutes.jsx'

function App() {
  return (
<Routes>
<Route path='/login' element={<PublicRotes>
  <Login/>
  </PublicRotes>}/>
<Route path='/register' element={<Register/>}/>
<Route path='/upload' element={<ProtectedRoutes>
  <Upload/>
</ProtectedRoutes>}/>
<Route path='/posts' element={<ProtectedRoutes>
  <Post/>
  </ProtectedRoutes>}/>
</Routes>
    // <div>App</div>
  )
}

export default App