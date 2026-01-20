import api from '../../api/axios'
import React, { useState } from 'react';
import { Upload, Image, Send, X, Check, AlertCircle } from 'lucide-react';
import { notification } from 'antd';

const FileUploader = () => {
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState('idle');
  const [text, setText] = useState('');
  const [image, setImage] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [previewUrl, setPreviewUrl] = useState('');

  const handleFileChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      const selectedFile = event.target.files[0];
      setFile(selectedFile);
      setStatus('idle');
      
      
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewUrl(e.target.result);
      };
      reader.readAsDataURL(selectedFile);
    }
  };
  
  const handleUpload = async () => {
  if (!file) {
    alert('Please select a file first!');
    return;
  }

  setStatus('uploading');
  const formData = new FormData();
  formData.append('file', file);
  
  try {
    const response = await api.post('/upload/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      onUploadProgress: (progressEvent) => {
        const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        setUploadProgress(percentCompleted);
      },
    });
    
    setImage(response.data.data);
    setStatus('success');
    setUploadProgress(0);
  } catch (error) {
    console.error('Upload error:', error);
    setStatus('error');
    setUploadProgress(0);
  }
};


const handleDATA = async () => {
  if (!text) {
    notification.error({
        title: error.response.data?.message || "Upload failed",
        description: " Text is required!",
        placement:'topRight'
      });
    return;
  }
  if (!image) {
    notification.error({
        title: error.response.data?.message || "failed!",
        description: "Image is required..!",
        placement:'topRight'
      });
    return;
  }

  try {
    console.log(text);
    const data = {
      postMessage: text,
      selectedFile: image
    };

    const token = localStorage.getItem('token');
    
    const response = await api.post('/post', data, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    
    console.log("RESPO===>", response);
    notification.success({
      title: "Success",
      description:response.data?.message || "Post uploaded successfully...",
      placement:"topRight"
    })
  
    
    // Reset form after success
    setTimeout(() => {
      setText('');
      setFile(null);
      setImage('');
      setPreviewUrl('');
      setStatus('idle');
    }, 2000);
    
  } catch (error) {
     notification.error({
        title: error.response.data?.message || "Upload failed",
        description: " failed..!",
        placement:'topRight'
      });
  }
};
  const handleRemoveImage = () => {
    setFile(null);
    setPreviewUrl('');
    setImage('');
    setStatus('idle');
  };

  const containerStyle = {
    maxWidth: '600px',
    margin: '40px auto',
    padding: '20px',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
  };

  const cardStyle = {
    background: '#fff',
    borderRadius: '12px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
    padding: '32px'
  };

  const headerStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '24px',
    paddingBottom: '16px',
    borderBottom: '2px solid #f0f0f0'
  };

  const titleStyle = {
    fontSize: '24px',
    fontWeight: '600',
    color: '#262626',
    margin: 0
  };

  const textAreaStyle = {
    width: '100%',
    minHeight: '120px',
    padding: '16px',
    fontSize: '15px',
    borderRadius: '8px',
    border: '1px solid #d9d9d9',
    resize: 'vertical',
    fontFamily: 'inherit',
    marginBottom: '8px',
    outline: 'none',
    transition: 'border-color 0.3s'
  };

  const charCountStyle = {
    textAlign: 'right',
    fontSize: '13px',
    color: text.length > 500 ? '#ff4d4f' : '#8c8c8c',
    marginBottom: '20px'
  };

  const uploadSectionStyle = {
    marginBottom: '20px',
    padding: '20px',
    background: '#fafafa',
    borderRadius: '8px',
    border: '2px dashed #d9d9d9'
  };

  const fileInputLabelStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    padding: '12px 24px',
    background: '#fff',
    border: '1px solid #d9d9d9',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '15px',
    fontWeight: '500',
    color: '#262626',
    transition: 'all 0.3s',
    width: '100%'
  };

  const fileInputStyle = {
    display: 'none'
  };

  const previewContainerStyle = {
    position: 'relative',
    marginTop: '16px',
    borderRadius: '8px',
    overflow: 'hidden'
  };

  const removeButtonStyle = {
    position: 'absolute',
    top: '8px',
    right: '8px',
    zIndex: 10,
    background: '#ff4d4f',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    padding: '8px 12px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    fontSize: '14px',
    fontWeight: '500',
    transition: 'background 0.3s'
  };

  const previewImageStyle = {
    width: '100%',
    borderRadius: '8px',
    display: 'block'
  };

  const progressBarContainerStyle = {
    marginTop: '16px',
    background: '#f0f0f0',
    borderRadius: '4px',
    overflow: 'hidden',
    height: '8px'
  };

  const progressBarStyle = {
    height: '100%',
    background: 'linear-gradient(90deg, #1890ff, #40a9ff)',
    width: `${uploadProgress}%`,
    transition: 'width 0.3s'
  };

  const buttonGroupStyle = {
    display: 'flex',
    gap: '12px',
    marginTop: '20px'
  };

  const buttonStyle = {
    flex: 1,
    padding: '14px 24px',
    borderRadius: '8px',
    border: 'none',
    fontSize: '15px',
    fontWeight: '500',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    transition: 'all 0.3s'
  };

  const uploadButtonStyle = {
    ...buttonStyle,
    background: !file || status === 'uploading' || status === 'success' ? '#f5f5f5' : '#fff',
    color: !file || status === 'uploading' || status === 'success' ? '#bfbfbf' : '#262626',
    border: '1px solid #d9d9d9'
  };

  const postButtonStyle = {
    ...buttonStyle,
    background: !text || !image ? '#f5f5f5' : '#1890ff',
    color: !text || !image ? '#bfbfbf' : '#fff'
  };

  const messageStyle = {
    marginTop: '12px',
    padding: '12px 16px',
    borderRadius: '6px',
    fontSize: '14px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  };

  const successMessageStyle = {
    ...messageStyle,
    background: '#f6ffed',
    color: '#52c41a',
    border: '1px solid #b7eb8f'
  };

  const errorMessageStyle = {
    ...messageStyle,
    background: '#fff2f0',
    color: '#ff4d4f',
    border: '1px solid #ffccc7'
  };

  const fileInfoStyle = {
    marginTop: '12px',
    padding: '12px',
    background: '#e6f7ff',
    borderRadius: '6px',
    fontSize: '14px',
    color: '#0050b3'
  };

  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        <div style={headerStyle}>
          <Image size={28} color="#1890ff" />
          <h2 style={titleStyle}>Create New Post</h2>
        </div>

        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="What's on your mind?"
          style={textAreaStyle}
          maxLength={500}
          onFocus={(e) => e.target.style.borderColor = '#1890ff'}
          onBlur={(e) => e.target.style.borderColor = '#d9d9d9'}
        />
        <div style={charCountStyle}>
          {text.length} / 500
        </div>

        <div style={uploadSectionStyle}>
          <label style={fileInputLabelStyle} htmlFor="file-upload">
            <Upload size={18} />
            Select Image
          </label>
          <input
            id="file-upload"
            type="file"
            onChange={handleFileChange}
            style={fileInputStyle}
            accept="image/*"
          />

          {file && !previewUrl && (
            <div style={fileInfoStyle}>
              📎 {file.name}
            </div>
          )}

          {status === 'uploading' && (
            <div style={progressBarContainerStyle}>
              <div style={progressBarStyle} />
            </div>
          )}

          {previewUrl && (
            <div style={previewContainerStyle}>
              <button
                style={removeButtonStyle}
                onClick={handleRemoveImage}
                onMouseEnter={(e) => e.target.style.background = '#ff7875'}
                onMouseLeave={(e) => e.target.style.background = '#ff4d4f'}
              >
                <X size={16} />
                Remove
              </button>
              <img
                src={previewUrl}
                alt="Preview"
                style={previewImageStyle}
              />
            </div>
          )}

          {status === 'success' && (
            <div style={successMessageStyle}>
              <Check size={16} />
              Image uploaded successfully!
            </div>
          )}

          {status === 'error' && (
            <div style={errorMessageStyle}>
              <AlertCircle size={16} />
              Error uploading file. Please try again.
            </div>
          )}
        </div>

        <div style={buttonGroupStyle}>
          <button
            onClick={handleUpload}
            disabled={!file || status === 'uploading' || status === 'success'}
            style={uploadButtonStyle}
            onMouseEnter={(e) => {
              if (!(!file || status === 'uploading' || status === 'success')) {
                e.target.style.background = '#fafafa';
              }
            }}
            onMouseLeave={(e) => {
              if (!(!file || status === 'uploading' || status === 'success')) {
                e.target.style.background = '#fff';
              }
            }}
          >
            <Upload size={18} />
            {status === 'uploading' ? 'Uploading...' : 'Upload Image'}
          </button>

          <button
            onClick={handleDATA}
            disabled={!text || !image}
            style={postButtonStyle}
            onMouseEnter={(e) => {
              if (!(!text || !image)) {
                e.target.style.background = '#40a9ff';
              }
            }}
            onMouseLeave={(e) => {
              if (!(!text || !image)) {
                e.target.style.background = '#1890ff';
              }
            }}
          >
            <Send size={18} />
            Post
          </button>
        </div>
      </div>
    </div>
  );
};

export default FileUploader;