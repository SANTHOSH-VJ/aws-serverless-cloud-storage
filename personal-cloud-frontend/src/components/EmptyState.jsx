import React, { useRef } from 'react';

const EmptyState = ({ onUpload, isUploading }) => {
  const fileInputRef = useRef(null);

  const handleButtonClick = () => {
    fileInputRef.current.click();
  };

  return (
    <div className="empty-state">
      <div className="empty-icon-wrapper">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M17.5 19C19.9853 19 22 16.9853 22 14.5C22 12.1332 20.1793 10.2033 17.8693 10.0195C17.4116 6.61208 14.4754 4 11 4C7.13401 4 4 7.13401 4 11C4 11.2332 4.01138 11.4638 4.03348 11.6908C2.28589 12.2741 1 13.9782 1 16C1 18.2091 2.79086 20 5 20H17.5Z"/>
        </svg>
      </div>
      <h2>No files yet</h2>
      <p>Upload your first file to start building your personal cloud library.</p>
      
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={onUpload} 
        style={{ display: 'none' }} 
      />
      
      <button 
        className="primary-btn mt-4" 
        onClick={handleButtonClick}
        disabled={isUploading}
      >
        {isUploading ? 'Uploading...' : '+ Upload File'}
      </button>
    </div>
  );
};

export default EmptyState;
