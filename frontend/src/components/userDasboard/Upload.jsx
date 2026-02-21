// import api from '../../api/axios'
// import React, { useState } from 'react';
// import { Upload, Image, Send, X, Check, AlertCircle } from 'lucide-react';
// import { notification } from 'antd';

// const FileUploader = ({ getPosts }) => {
//   const [file, setFile] = useState(null);
//   const [status, setStatus] = useState("idle");
//   const [text, setText] = useState("");
//   const [image, setImage] = useState("");
//   const [uploadProgress, setUploadProgress] = useState(0);
//   const [previewUrl, setPreviewUrl] = useState("");

//   const handleFileChange = (event) => {
//     if (event.target.files && event.target.files[0]) {
//       const selectedFile = event.target.files[0];
//       setFile(selectedFile);
//       setStatus("idle");

//       setPreviewUrl("");
//       setImage("");

//       const reader = new FileReader();
//       reader.onload = (e) => {
//         setPreviewUrl(e.target.result);
//       };
//       reader.readAsDataURL(selectedFile);
//     }
//   };

//   const handleUpload = async () => {
//     if (!file) {
//       alert("Please select a file first!");
//       return;
//     }

//     setStatus("uploading");
//     const formData = new FormData();
//     formData.append("file", file);

//     try {
//       const response = await api.post("/upload/upload", formData, {
//         headers: {
//           "Content-Type": "multipart/form-data",
//         },
//         // onUploadProgress: (progressEvent) => {
//         //   const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
//         //   setUploadProgress(percentCompleted);
//         // },
//       });

//       setImage(response.data.data);
//       setStatus("success");
//       // setUploadProgress(0);
//     } catch (error) {
//       console.error("Upload error:", error);
//       setStatus("error");
//       // setUploadProgress(0);
//     }
//   };

//   const handleDATA = async () => {
//     if (!text) {
//       notification.error({
//         message: "Validation Error",
//         description: "Text is required!",
//         placement: "topRight",
//       });
//       return;
//     }
//     if (!image) {
//       notification.error({
//          message: "Validation Error",
//   description: "image is required!",
//         placement: "topRight",
//       });
//       return;
//     }

//     try {
//       console.log(text);
//       const data = {
//         postMessage: text,
//         selectedFile: image,
//       };

//       const token = localStorage.getItem("token");

//       const response = await api.post("/post", data, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//           "Content-Type": "application/json",
//         },
//       });

//       console.log("RESPO===>", response);
//       getPosts();
//       notification.success({
//         message: "Success",
//         description: response.data?.message || "Post uploaded successfully...",
//         placement: "topRight",
//       });

//       // Reset form after success
//       setTimeout(() => {
//         setText("");
//         setFile(null);
//         setImage("");
//         setPreviewUrl("");
//         setStatus("idle");
//       }, 2000);
//     } catch (error) {
//       notification.error({
//         message: error.response.data?.message || "Upload failed",
//         description: " failed..!",
//         placement: "topRight",
//       });
//     }
//   };
//   // const handleRemoveImage = () => {
//   //   setFile(null);
//   //   setPreviewUrl('');
//   //   setImage('');
//   //   setStatus('idle');
//   // };

//   const containerStyle = {
//     maxWidth: "600px",
//     margin: "0px auto",
//     padding: "10px",
//     fontFamily:
//       '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
//   };

//   const cardStyle = {
//     background: "#fff",
//     borderRadius: "12px",
//     boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
//     padding: "20px",
//   };

//   const headerStyle = {
//     display: "flex",
//     alignItems: "center",
//     gap: "12px",
//     marginBottom: "24px",
//     paddingBottom: "16px",
//     borderBottom: "2px solid #f0f0f0",
//   };

//   const titleStyle = {
//     fontSize: "24px",
//     fontWeight: "600",
//     color: "#262626",
//     margin: 0,
//   };

//   const textAreaStyle = {
//     width: "100%",
//     minHeight: "20px",
//     // padding: '16px',
//     fontSize: "15px",
//     // borderRadius: '8px',
//     // border: '1px solid #d9d9d9',
//     // resize: 'vertical',
//     fontFamily: "inherit",
//     // marginBottom: '8px',
//     outline: "none",
//     // transition: 'border-color 0.3s'
//   };

//   // const charCountStyle = {
//   //   textAlign: 'right',
//   //   fontSize: '13px',
//   //   color: text.length > 500 ? '#ff4d4f' : '#8c8c8c',
//   //   marginBottom: '20px'
//   // };

//   const uploadSectionStyle = {
//     // marginBottom: '20px',
//     // padding: '20px',
//     // background: '#fafafa',
//     // borderRadius: '8px',
//     border: "2px dashed #d9d9d9",
//   };

//   const fileInputLabelStyle = {
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "center",
//     // gap: '8px',
//     padding: "12px 24px",
//     background: "#fff",
//     border: "1px solid #d9d9d9",
//     borderRadius: "6px",
//     cursor: "pointer",
//     fontSize: "15px",
//     fontWeight: "500",
//     color: "#262626",
//     transition: "all 0.3s",
//     width: "100%",
//   };

//   const fileInputStyle = {
//     display: "none",
//   };

//   const previewContainerStyle = {
//     position: "relative",
//     marginTop: "16px",
//     borderRadius: "8px",
//     overflow: "hidden",
//   };

//   // const removeButtonStyle = {
//   //   position: 'absolute',
//   //   top: '8px',
//   //   right: '8px',
//   //   zIndex: 10,
//   //   background: '#ff4d4f',
//   //   color: '#fff',
//   //   border: 'none',
//   //   borderRadius: '6px',
//   //   padding: '8px 12px',
//   //   cursor: 'pointer',
//   //   display: 'flex',
//   //   alignItems: 'center',
//   //   gap: '4px',
//   //   fontSize: '14px',
//   //   fontWeight: '500',
//   //   transition: 'background 0.3s'
//   // };

//   const previewImageStyle = {
//     width: "100%",
//     borderRadius: "8px",
//     display: "block",
//   };

//   const progressBarContainerStyle = {
//     marginTop: "16px",
//     background: "#f0f0f0",
//     borderRadius: "4px",
//     overflow: "hidden",
//     height: "8px",
//   };

//   const progressBarStyle = {
//     height: "100%",
//     background: "linear-gradient(90deg, #1890ff, #40a9ff)",
//     width: `${uploadProgress}%`,
//     transition: "width 0.3s",
//   };

//   const buttonGroupStyle = {
//     display: "flex",
//     gap: "12px",
//     marginTop: "10px",
//   };

//   const buttonStyle = {
//     flex: 1,
//     padding: "6px 8px",
//     borderRadius: "8px",
//     border: "none",
//     fontSize: "9px",
//     fontWeight: "500",
//     cursor: "pointer",
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "center",
//     gap: "8px",
//     transition: "all 0.3s",
//   };

//   const uploadButtonStyle = {
//     ...buttonStyle,
//     background:
//       !file || status === "uploading" || status === "success"
//         ? "#f5f5f5"
//         : "#fff",
//     color:
//       !file || status === "uploading" || status === "success"
//         ? "#bfbfbf"
//         : "#262626",
//     border: "1px solid #d9d9d9",
//   };

//   const postButtonStyle = {
//     ...buttonStyle,
//     background: !text || !image ? "#f5f5f5" : "#1890ff",
//     color: !text || !image ? "#bfbfbf" : "#fff",
//   };

//   const messageStyle = {
//     marginTop: "12px",
//     padding: "12px 16px",
//     borderRadius: "6px",
//     fontSize: "14px",
//     display: "flex",
//     alignItems: "center",
//     gap: "8px",
//   };

//   const successMessageStyle = {
//     ...messageStyle,
//     background: "#f6ffed",
//     color: "#52c41a",
//     border: "1px solid #b7eb8f",
//   };

//   const errorMessageStyle = {
//     ...messageStyle,
//     background: "#fff2f0",
//     color: "#ff4d4f",
//     border: "1px solid #ffccc7",
//   };

//   const fileInfoStyle = {
//     marginTop: "12px",
//     padding: "12px",
//     background: "#e6f7ff",
//     borderRadius: "6px",
//     fontSize: "14px",
//     color: "#0050b3",
//   };

//   return (
//     <div style={containerStyle}>
//       <div style={cardStyle}>
//         <div style={headerStyle}>
//           {/* <Image size={28} color="#1890ff" /> */}
//           <h2 style={titleStyle}>Create New Post</h2>
//         </div>

//         <textarea
//           value={text}
//           onChange={(e) => setText(e.target.value)}
//           placeholder="What's on your mind?"
//           style={textAreaStyle}
//           maxLength={500}
//           onFocus={(e) => (e.target.style.borderColor = "#1890ff")}
//           onBlur={(e) => (e.target.style.borderColor = "#d9d9d9")}
//         />
//         {/* <div style={charCountStyle}>
//           {text.length} / 500
//         </div> */}

//         <div style={uploadSectionStyle}>
//           <label style={fileInputLabelStyle} htmlFor="file-upload">
//             {/* <Upload size={18} /> */}
//             Select Image
//           </label>
//           <input
//             id="file-upload"
//             type="file"
//             onChange={handleFileChange}
//             style={fileInputStyle}
//             accept="image/*"
//           />

//           {file && !previewUrl && <div style={fileInfoStyle}>{file.name}</div>}

//           {status === "uploading" && (
//             <div style={progressBarContainerStyle}>
//               <div style={progressBarStyle} />
//             </div>
//           )}

//           {previewUrl && (
//             <div style={previewContainerStyle}>
//               {/* <button
//                 // style={removeButtonStyle}
//                 // onClick={handleRemoveImage}
//                 onMouseEnter={(e) => e.target.style.background = '#ff7875'}
//                 onMouseLeave={(e) => e.target.style.background = '#ff4d4f'}
//               >
//                 <X size={16} />
//                 Remove
//               </button> */}
//               <img src={previewUrl} alt="Preview" style={previewImageStyle} />
//             </div>
//           )}

//           {status === "success" && (
//             <div style={successMessageStyle}>
//               <Check size={16} />
//               Image uploaded successfully!
//             </div>
//           )}

//           {status === "error" && (
//             <div style={errorMessageStyle}>
//               <AlertCircle size={16} />
//               Error uploading file. Please try again.
//             </div>
//           )}
//         </div>

//         <div style={buttonGroupStyle}>
//           <button
//             onClick={handleUpload}
//             disabled={!file || status === "uploading" || status === "success"}
//             style={uploadButtonStyle}
//             onMouseEnter={(e) => {
//               if (!(!file || status === "uploading" || status === "success")) {
//                 e.target.style.background = "#fafafa";
//               }
//             }}
//             onMouseLeave={(e) => {
//               if (!(!file || status === "uploading" || status === "success")) {
//                 e.target.style.background = "#fff";
//               }
//             }}
//           >
//             {/* <Upload size={18} /> */}
//             {status === "uploading" ? "Uploading..." : "Upload Image"}
//           </button>

//           <button
//             onClick={handleDATA}
//             disabled={!text || !image || status === "uploading"}
//             // disabled={!text || !image}
//             style={postButtonStyle}
//             onMouseEnter={(e) => {
//               if (!(!text || !image)) {
//                 e.target.style.background = "#40a9ff";
//               }
//             }}
//             onMouseLeave={(e) => {
//               if (!(!text || !image)) {
//                 e.target.style.background = "#1890ff";
//               }
//             }}
//           >
//             {/* <Send size={18} /> */}
//             Post
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default FileUploader;

// import api from "../../api/axios";
// import React, { useState } from "react";
// import { Upload, Send, X, Check, AlertCircle } from "lucide-react";
// import { notification } from "antd";

// const FileUploader = ({ getPosts }) => {
//   const [file, setFile] = useState(null);
//   const [status, setStatus] = useState("idle");
//   const [text, setText] = useState("");
//   const [image, setImage] = useState("");
//   const [uploadProgress, setUploadProgress] = useState(0);
//   const [previewUrl, setPreviewUrl] = useState("");

//   // Handle file selection
//   const handleFileChange = (event) => {
//     if (event.target.files && event.target.files[0]) {
//       const selectedFile = event.target.files[0];
//       setFile(selectedFile);
//       setStatus("idle");

//       const reader = new FileReader();
//       reader.onload = (e) => setPreviewUrl(e.target.result);
//       reader.readAsDataURL(selectedFile);

//       setImage(""); // reset uploaded image
//     }
//   };

//   // Handle file upload
//   const handleUpload = async () => {
//     if (!file) return alert("Please select a file first!");
//     setStatus("uploading");

//     const formData = new FormData();
//     formData.append("file", file);

//     try {
//       const token = localStorage.getItem("token");
//       const response = await api.post("/upload/upload", formData, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//           "Content-Type": "multipart/form-data",
//         },
//         // Optional: progress
//         // onUploadProgress: (e) => setUploadProgress(Math.round((e.loaded * 100) / e.total)),
//       });

//       setImage(response.data.data);
//       setStatus("success");
//       setUploadProgress(0);
//     } catch (error) {
//       console.error("Upload error:", error);
//       setStatus("error");
//       setUploadProgress(0);
//     }
//   };

//   // Handle post submission
//   const handleDATA = async () => {
//     if (!text)
//       return notification.error({
//         message: "Text is required!",
//         placement: "topRight",
//       });
//     if (!image)
//       return notification.error({
//         message: "Image is required!",
//         placement: "topRight",
//       });

//     try {
//       const token = localStorage.getItem("token");
//       const response = await api.post(
//         "/post",
//         { postMessage: text, selectedFile: image },
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             "Content-Type": "application/json",
//           },
//         },
//       );

//       getPosts();
//       notification.success({
//         message: "Success",
//         description: response.data?.message || "Post uploaded successfully",
//         placement: "topRight",
//       });

//       // Reset everything
//       setTimeout(() => {
//         setText("");
//         setFile(null);
//         setImage("");
//         setPreviewUrl("");
//         setStatus("idle");
//       }, 1500);
//     } catch (error) {
//       notification.error({
//         message: error.response?.data?.message || "Upload failed",
//         placement: "topRight",
//       });
//     }
//   };

//   const removeImage = () => {
//     setFile(null);
//     setPreviewUrl("");
//     setImage("");
//     setStatus("idle");
//   };

//   return (
//     <div
//       style={{
//         maxWidth: 600,
//         margin: "0 auto",
//         padding: 10,
//         fontFamily: "Arial, sans-serif",
//       }}
//     >
//       <div
//         style={{
//           background: "#fff",
//           borderRadius: 12,
//           padding: 20,
//           boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
//         }}
//       >
//         <h2 style={{ fontSize: 24, fontWeight: 600, marginBottom: 24 }}>
//           Create New Post
//         </h2>

//         <textarea
//           value={text}
//           onChange={(e) => setText(e.target.value)}
//           placeholder="What's on your mind?"
//           maxLength={500}
//           style={{
//             width: "100%",
//             minHeight: 80,
//             fontSize: 15,
//             fontFamily: "inherit",
//             outline: "none",
//             padding: 10,
//             borderRadius: 6,
//             border: "1px solid #d9d9d9",
//           }}
//           disabled={status === "uploading"}
//         />

//         <div
//           style={{
//             border: "2px dashed #d9d9d9",
//             borderRadius: 6,
//             padding: 10,
//             marginTop: 16,
//           }}
//         >
//           <label
//             style={{
//               display: "block",
//               cursor: "pointer",
//               textAlign: "center",
//               padding: 12,
//               border: "1px solid #d9d9d9",
//               borderRadius: 6,
//               marginBottom: 10,
//             }}
//             htmlFor="file-upload"
//           >
//             Select Image
//           </label>
//           <input
//             id="file-upload"
//             type="file"
//             onChange={handleFileChange}
//             accept="image/*"
//             style={{ display: "none" }}
//           />

//           {file && !previewUrl && (
//             <div
//               style={{ padding: 12, background: "#e6f7ff", borderRadius: 6 }}
//             >
//               {file.name}
//             </div>
//           )}

//           {status === "uploading" && (
//             <div
//               style={{
//                 marginTop: 16,
//                 height: 8,
//                 background: "#f0f0f0",
//                 borderRadius: 4,
//               }}
//             >
//               <div
//                 style={{
//                   width: `${uploadProgress}%`,
//                   height: "100%",
//                   background: "linear-gradient(90deg, #1890ff, #40a9ff)",
//                   transition: "width 0.3s",
//                 }}
//               />
//             </div>
//           )}

//           {previewUrl && (
//             <div style={{ position: "relative", marginTop: 16 }}>
//               <img
//                 src={previewUrl}
//                 alt="Preview"
//                 style={{ width: "100%", borderRadius: 8 }}
//               />
//               <button
//                 onClick={removeImage}
//                 style={{
//                   position: "absolute",
//                   top: 8,
//                   right: 8,
//                   background: "#ff4d4f",
//                   color: "#fff",
//                   border: "none",
//                   borderRadius: 6,
//                   padding: "4px 8px",
//                   cursor: "pointer",
//                 }}
//               >
//                 <X size={16} /> Remove
//               </button>
//             </div>
//           )}

//           {status === "success" && (
//             <div
//               style={{
//                 marginTop: 12,
//                 padding: 12,
//                 borderRadius: 6,
//                 background: "#f6ffed",
//                 color: "#52c41a",
//                 border: "1px solid #b7eb8f",
//                 display: "flex",
//                 alignItems: "center",
//                 gap: 8,
//               }}
//             >
//               <Check size={16} /> Image uploaded successfully!
//             </div>
//           )}
//           {status === "error" && (
//             <div
//               style={{
//                 marginTop: 12,
//                 padding: 12,
//                 borderRadius: 6,
//                 background: "#fff2f0",
//                 color: "#ff4d4f",
//                 border: "1px solid #ffccc7",
//                 display: "flex",
//                 alignItems: "center",
//                 gap: 8,
//               }}
//             >
//               <AlertCircle size={16} /> Error uploading file. Please try again.
//             </div>
//           )}
//         </div>

//         <div style={{ display: "flex", gap: 12, marginTop: 10 }}>
//           <button
//             onClick={handleUpload}
//             disabled={!file || status === "uploading" || status === "success"}
//             style={{
//               flex: 1,
//               padding: 8,
//               borderRadius: 6,
//               border: "1px solid #d9d9d9",
//               background: "#fff",
//               cursor: "pointer",
//             }}
//           >
//             {status === "uploading" ? "Uploading..." : "Upload Image"}
//           </button>
//           <button
//             onClick={handleDATA}
//             disabled={!text || !image || status === "uploading"}
//             style={{
//               flex: 1,
//               padding: 8,
//               borderRadius: 6,
//               border: "none",
//               background: "#1890ff",
//               color: "#fff",
//               cursor: "pointer",
//             }}
//           >
//             Post
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default FileUploader;
import api from "../../api/axios";
import React, { useState, useCallback } from "react";
import { Upload, Send, X, Check, AlertCircle, Loader2 } from "lucide-react";
import { notification } from "antd";

const FileUploader = ({ getPosts }) => {
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState("idle"); // idle | uploading | success | error
  const [text, setText] = useState("");
  const [imagePath, setImagePath] = useState("");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [previewUrl, setPreviewUrl] = useState("");

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setStatus("idle");
      setUploadProgress(0);

      // Create local preview
      const url = URL.createObjectURL(selectedFile);
      setPreviewUrl(url);
      setImagePath("");
    }
  };

  const handleUploadAndPost = async () => {
    if (!text)
      return notification.warning({ message: "Please enter some text." });
    if (!file)
      return notification.warning({ message: "Please select an image." });

    setStatus("uploading");
    const formData = new FormData();
    formData.append("file", file);

    try {
      const token = localStorage.getItem("token");

      // 1. Upload Image
      const uploadRes = await api.post("/upload/upload", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total,
          );
          setUploadProgress(percentCompleted);
        },
      });

      const uploadedImageUrl = uploadRes.data.data;

      
      const postResponse = await api.post(
        "/post",
        { postMessage: text, selectedFile: uploadedImageUrl },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      notification.success({
        message: "Post Created",
        description: postResponse.data?.message || "Your post is live!",
      });

     
      resetForm();
      if (getPosts) getPosts();
    } catch (error) {
      console.error("Submission error:", error);
      setStatus("error");
      notification.error({
        message: "Post Failed",
        description: error.response?.data?.message || "Something went wrong.",
      });
    }
  };

  const resetForm = () => {
    setText("");
    setFile(null);
    setImagePath("");
    setPreviewUrl("");
    setUploadProgress(0);
    setStatus("idle");
  };

  return (
    <div style={{ maxWidth: 600, margin: "20px auto", padding: 10 }}>
      <div
        style={{
          background: "#fff",
          borderRadius: 12,
          padding: 20,
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
        }}
      >
        <h2 style={{ fontSize: 20, fontWeight: 600, marginBottom: 16 }}>
          Create Post
        </h2>

        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="What's on your mind?"
          style={{
            width: "100%",
            minHeight: 100,
            padding: 12,
            borderRadius: 8,
            border: "1px solid #d9d9d9",
            outline: "none",
            resize: "none",
          }}
          disabled={status === "uploading"}
        />

        <div
          style={{
            marginTop: 16,
            border: "2px dashed #e8e8e8",
            borderRadius: 8,
            padding: 10,
          }}
        >
          {!previewUrl ? (
            <label
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                cursor: "pointer",
                padding: "20px 0",
              }}
            >
              {/* <Upload color="#8c8c8c" /> */}
              <span style={{ color: "#8c8c8c", marginTop: 8 }}>
                Click to upload image
              </span>
              <input
                type="file"
                onChange={handleFileChange}
                accept="image/*"
                style={{ display: "none" }}
              />
            </label>
          ) : (
            <div style={{ position: "relative" }}>
              <img
                src={previewUrl}
                alt="Preview"
                style={{ width: "100%", borderRadius: 8, display: "block" }}
              />
              {status !== "uploading" && (
                <button
                  onClick={resetForm}
                  style={{
                    position: "absolute",
                    top: 10,
                    right: 10,
                    background: "rgba(0,0,0,0.6)",
                    border: "none",
                    borderRadius: "50%",
                    padding: 5,
                    cursor: "pointer",
                  }}
                >
                  <X size={18} color="#fff" />
                </button>
              )}
            </div>
          )}

          {status === "uploading" && (
            <div style={{ marginTop: 12 }}>
              <div
                style={{
                  height: 6,
                  background: "#f0f0f0",
                  borderRadius: 3,
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    width: `${uploadProgress}%`,
                    height: "100%",
                    background: "#1890ff",
                    transition: "width 0.2s",
                  }}
                />
              </div>
              <p
                style={{
                  fontSize: 12,
                  color: "#8c8c8c",
                  textAlign: "right",
                  marginTop: 4,
                }}
              >
                {uploadProgress}%
              </p>
            </div>
          )}
        </div>

        <button
          onClick={handleUploadAndPost}
          disabled={!text || !file || status === "uploading"}
          style={{
            width: "100%",
            marginTop: 16,
            padding: "12px",
            borderRadius: 8,
            border: "none",
            background: status === "uploading" ? "#bae7ff" : "#1890ff",
            color: "#fff",
            fontWeight: 600,
            cursor: "pointer",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: 8,
          }}
        >
          {status === "uploading" ? (
            <>
              <Loader2 className="animate-spin" size={18} /> Posting...
            </>
          ) : (
            "Post Now"
          )}
        </button>
      </div>
    </div>
  );
};

export default FileUploader;