
import React from 'react';
import { LoadingOutlined } from '@ant-design/icons';
import { Flex, Spin } from 'antd';
const Loader = () => (
  <Flex style={{
    marginTop:"20px",
    display:"flex",
    justifyContent:'center',
    // alignItems:"center"
  }}>
    {/* <Spin indicator={<LoadingOutlined spin />} size="small" /> */}
    {/* <Spin indicator={<LoadingOutlined spin />} /> */}
    {/* <Spin indicator={<LoadingOutlined spin />} size="large" /> */}
    <Spin indicator={<LoadingOutlined style={{ fontSize: 48,color:"black" }} spin />} />
  </Flex>
);
export default Loader;