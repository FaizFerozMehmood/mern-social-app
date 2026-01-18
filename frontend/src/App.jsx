
import React from 'react'
import {Route,Routes} from "react-router-dom"
import Login from './components/pages/Login.jsx'
import Register from './components/pages/Register.jsx'

function App() {
  return (
<Routes>
<Route path='/' element={<Login/>}/>
<Route path='/register' element={<Register/>}/>
</Routes>
    // <div>App</div>
  )
}

export default App