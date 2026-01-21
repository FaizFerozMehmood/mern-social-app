import React, { useEffect, useState } from 'react'
import api from '../api/axios'
import { Avatar } from 'antd'
import { CommentOutlined } from '@ant-design/icons';

function Post() {
  const [data, setData] = useState([])

  useEffect(() => {
    const getPosts = async () => {
      const token = localStorage.getItem('token')

      try {
        const response = await api.get('/post', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        setData(response.data.posts)

      } catch (error) {
        console.log(error)
      }
    }

    getPosts()
  }, [])

  return (
    <div>
      {data.map((d) => (
        <div
          key={d._id}
          style={{ border: '1px solid #ccc', margin: '10px', padding: '10px' }}
        >

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
           {d.userId?.profileImage ? (
  <img
    src={d.userId.profileImage}
    alt="creator"
    height={40}
    width={40}
    style={{ borderRadius: '50%' }}
  />
) : (
      <Avatar style={{ backgroundColor: '#fde3cf', color: '#f56a00' }}>{d.userId?.userName.split('')[0]}</Avatar>

)}
            <strong>{d.userId?.userName}</strong>
          </div>

          <p>{new Date(d.createdAt).toLocaleString()}</p>
          <p>{d.postMessage}</p>

          {d.selectedFile && (
            <img src={d.selectedFile} alt="post" height={100} width={100} />
          )}

          <p>Likes: {d.likeCount}</p>

          
          <div style={{ marginLeft: '20px' }}>
            <h4>Comments</h4>

            {d.comments.length === 0 && <p>No comments</p>}

            {d.comments.map((c) => (
              <div key={c._id} style={{ marginBottom: '8px' }}>
                <p>{c.text}</p>
<CommentOutlined />
               
                <small>
                  Comment by: {c.userId?.userName || 'Anonymous'}
                </small>
 <small>
                   {new Date(c.createdAt).toLocaleString()}
                </small>
                <br />

                {c.userId?.profileImage && (
                  <img
                    src={c.userId.profileImage || c.userId?.userName.split('').toUpperCase()[0] }
                    alt="comment-user"
                    height={30}
                    width={30}
                  />
                )}
                

              </div>
            ))}
          </div>

        </div>
      ))}
    </div>
  )
}

export default Post
