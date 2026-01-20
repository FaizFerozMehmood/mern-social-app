
import React from 'react'
import api from '../api/axios'

function Post() {
  const getPosts = async()=>{
    const token = localStorage.getItem('token')
    try {
      const response = await api.get('/post',{
        headers:{
          Authorization:`Bearer ${token}`,
         
        }
      })
      console.log(response)
    } catch (error) {
      
    }
  }
    getPosts()
  return (
    <div>
      <div style={{
       maxHeight:'100vh',

      }}>

      <div style={{
        display:'flex',
        justifyContent:"center",
        // padding:"50px",
        border:"2px solid black"
      }}>
        <img src="" alt="" height={100} width={100}/>
      </div>
      </div>
    </div>
  )
}

export default Post