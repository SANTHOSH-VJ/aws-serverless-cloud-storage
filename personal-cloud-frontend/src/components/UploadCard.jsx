import React, { useState, useRef } from 'react';

const UploadCard = ({ onUpload, isUploading }) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      // Mock event structure for the existing handler
      onUpload({ target: { files: e.dataTransfer.files } });
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current.click();
  };

  return (
    <div 
      className={`upload-card ${isDragging ? 'dragging' : ''}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <div className="upload-icon-wrapper">
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
          <polyline points="17 8 12 3 7 8"></polyline>
          <line x1="12" y1="3" x2="12" y2="15"></line>
        </svg>
      </div>
      <h3>Upload Files</h3>
      <p>Drag and drop your files here or browse</p>
      
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={onUpload} 
        style={{ display: 'none' }} 
      />
      
      <button 
        className="primary-btn" 
        onClick={handleButtonClick}
        disabled={isUploading}
      >
        {isUploading ? 'Uploading...' : '+ New Upload'}
      </button>
    </div>
  );
};

export default UploadCard;
