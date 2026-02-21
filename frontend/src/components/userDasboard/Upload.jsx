
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
          placeholder="What's on your mind....?"
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