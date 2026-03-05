import { HashLoader } from "react-spinners";

import React from 'react';

const Loader = () => (
  <div
    style={{
      // marginTop: "20px",
      display: "flex",
      justifyContent: "center",
      alignItems:"center",
      height:"90vh",
      width:"100%"
    }}
  >
    {/* <Spin indicator={<LoadingOutlined spin />} size="small" /> */}
    {/* <Spin indicator={<LoadingOutlined spin />} /> */}
    {/* <Spin indicator={<LoadingOutlined spin />} size="large" /> */}

    <HashLoader size={40} color="#22c55e" /> 
  </div>
);
export default Loader;