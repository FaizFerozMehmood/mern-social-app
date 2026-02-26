import React from 'react';
import { Button, Checkbox, Form, Input,notification } from 'antd';
import api from '../../api/axios';
import { Link, useNavigate } from "react-router-dom";
import { useState } from 'react';





function Login() {
  const [isLoading,setIsLoading] = useState(false)
  const navigate = useNavigate()
  const onFinish = async(values) => {
  console.log('Success:', values);

try {
  setIsLoading(true)
    const response =  await api.post("/login",values)
    localStorage.setItem("id",response.data?.id)
    console.log(response.data)
    localStorage.setItem("token",response?.data?.token)
    notification.success({
      message: "Success",
      description:response.data?.message || "Welcome back...",
      placement:"topRight"
    })
    
   navigate('/')

} catch (error) {
   notification.error({
     message: error?.response?.data?.message || "Login failed",
    //  description: "Invalid email or password",
     placement: "topRight",
   });
}finally{
  setIsLoading(false)
}
};
const onFinishFailed = errorInfo => {
  console.log('Failed:', errorInfo);
 
};

  return (
    <>
      <div
        style={{
          backgroundColor: "#f5f7fa",
          minHeight: "100vh",
          // minWidth:"100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: "16px",
        }}
      >
        <div
          style={{
            backgroundColor: "#fff",
            width: "100%",
            maxWidth: "380px",
            padding: "32px",
            borderRadius: "10px",
            boxShadow: "0 8px 24px rgba(0,0,0,0.1) ",
          }}
        >
          <h2 style={{ textAlign: "center", marginBottom: "24px" }}>Login</h2>
          <Form
            name="basic"
            // style={{ maxWidth: 600 }}
            initialValues={{ remember: true }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
          >
            <Form.Item
              label="email"
              name="email"
              rules={[
                { required: true, message: "Please input your email!" },
                { type: "email", message: "Please enter a valid email!" },
              ]}
            >
              <Input placeholder="exp@gmail.com" />
            </Form.Item>

            <Form.Item
              label="Password"
              name="password"
              rules={[
                { required: true, message: "Please input your password!" },
              ]}
            >
              <Input.Password placeholder="exp123" />
            </Form.Item>

            {/* <Form.Item name="remember" valuePropName="checked" label={null}>
      <Checkbox>Remember me</Checkbox>
    </Form.Item> */}

            <Form.Item label={null}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <Button
                  style={{
                    padding: "20px 90px",
                  }}
                  type="primary"
                  htmlType="submit"
                  loading={isLoading}
                  disabled={isLoading}
                  block
                  size="large"
                >
                  Login
                </Button>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <p style={{ marginTop: "20px" }}>
                  Don't have an account?{" "}
                  <Link to={"/register"}>Register Now!</Link>
                </p>
              </div>
            </Form.Item>
          </Form>
        </div>
      </div>
    </>
  );
}

export default Login