
import React from 'react'
import {Route,Routes} from "react-router-dom"
import Login from './components/pages/Login.jsx'

function App() {
  return (
<Routes>
<Route path='/' element={<Login/>}/>
</Routes>
    // <div>App</div>
  )
}

export default App