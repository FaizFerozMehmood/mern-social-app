

import React from 'react'
import { Button, Form, Input,notification } from 'antd';
import api from '../../api/axios';
import { Link, useNavigate } from "react-router-dom";
function Register() {
const navigate = useNavigate()
    const onFinish = async(values) => {
      console.log('Success:', values);
    
    try {
        const response =  await api.post("/create",values)
        console.log(response.data)
        notification.success({
            title: "Done",
            description:response.data?.message || "Registered...!y",
            placement:"topRight"
        })
        setTimeout(()=>{
            navigate("/")

        },2000)
    } catch (error) {
       notification.error({
        title:" Registration failed",
        description: "Invalid email or password",
        placement:'topRight'
      })
    }
    };
    const onFinishFailed = errorInfo => {
      console.log('Failed:', errorInfo);
     
    };
  return (
     <div style={{
    backgroundColor:"#f5f7fa",
    minHeight:"100vh",
    // minWidth:"100%",
    display:"flex",
    justifyContent:"center",
    alignItems:"center",
    padding:"16px"
  }}>
    <div style={{
      backgroundColor:"#fff",
      width:"100%",
      maxWidth:"380px",
      padding:"32px",
      borderRadius:"10px" ,
      boxShadow: "0 8px 24px rgba(0,0,0,0.1) "
    }}>
<h2 style={{textAlign:"center",marginBottom:"24px"}}>Create Account</h2>
  <Form
    name="basic"
    // style={{ maxWidth: 600 }}
    // initialValues={{ remember: true }}
    onFinish={onFinish}
    onFinishFailed={onFinishFailed}
    autoComplete="off"
  >
    <Form.Item
      label="userName"
      name="userName"
      rules={[{ required: true, message: 'Please input user name!' }]}
    >
      <Input />
    </Form.Item>
    <Form.Item
      label="email"
      name="email"
      rules={[{ required: true, message: 'Please input your email!' }]}
    >
      <Input />
    </Form.Item>

    <Form.Item
      label="Password"
      name="password"
      rules={[{ required: true, message: 'Please input your password!' }]}
    >
      <Input.Password />
    </Form.Item>

    {/* <Form.Item name="remember" valuePropName="checked" label={null}>
      <Checkbox>Remember me</Checkbox>
    </Form.Item> */}

    <Form.Item label={null}>
      <div style={{
        display:'flex',
        justifyContent:"center"
      }}>

      <Button style={{
        padding:"20px 90px",
      }} type="primary" htmlType="submit">
        Submit
      </Button>

        </div>
         <div style={{
        display:'flex',
        justifyContent:"center"
      }}>
        <p style={{marginTop:"20px"}}>Already have an account? <Link to={'/register'}>Login Now!</Link></p>

      </div>
    </Form.Item>
  </Form>
    </div>

  </div>
  )
}

export default Register