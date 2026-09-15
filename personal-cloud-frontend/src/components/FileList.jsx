import React, { useState, useEffect, useRef } from 'react';

const getFileType = (filename) => {
  const ext = filename.split('.').pop().toLowerCase();
  switch (ext) {
    case 'pdf': return 'PDF';
    case 'png':
    case 'jpg':
    case 'jpeg':
    case 'gif': return 'Image';
    case 'zip':
    case 'rar':
    case 'tar':
    case 'gz': return 'Archive';
    case 'doc':
    case 'docx': return 'Document';
    case 'xls':
    case 'xlsx':
    case 'csv': return 'Spreadsheet';
    case 'ppt':
    case 'pptx': return 'Presentation';
    case 'txt': return 'Text';
    default: return 'File';
  }
};

const FileRow = ({ file, onDownload, onShare, onDelete, isDeleting, isSharing }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  const fileType = getFileType(file);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <tr className="file-row">
      <td className="file-name-col">
        <div className="file-name-wrapper">
          <svg className="file-type-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"></path><polyline points="13 2 13 9 20 9"></polyline></svg>
          <span className="truncate" title={file}>{file}</span>
        </div>
      </td>
      <td className="file-type-col">{fileType}</td>
      <td className="file-size-col">—</td>
      <td className="file-date-col">—</td>
      <td className="file-action-col">
        <div className="action-menu-container" ref={menuRef}>
          <button className="action-toggle" onClick={() => setMenuOpen(!menuOpen)}>⋮</button>
          {menuOpen && (
            <div className="action-dropdown">
              <button onClick={() => { onDownload(file); setMenuOpen(false); }}>
                Download
              </button>
              <button className="share-action" onClick={() => { onShare(file); setMenuOpen(false); }} disabled={isSharing}>
                {isSharing ? 'Sharing...' : 'Share'}
              </button>
              <button className="delete-action" onClick={() => { onDelete(file); setMenuOpen(false); }} disabled={isDeleting}>
                {isDeleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          )}
        </div>
      </td>
    </tr>
  );
};

const FileList = ({ files, onDownload, onShare, onDelete, deletingFiles, sharingFiles }) => {
  return (
    <div className="file-list-container">
      <div className="file-list-header">
        <h3>My Files</h3>
      </div>
      <div className="table-responsive">
        <table className="file-table">
          <thead>
            <tr>
              <th className="file-name-col">Name</th>
              <th className="file-type-col">Type</th>
              <th className="file-size-col">Size</th>
              <th className="file-date-col">Modified</th>
              <th className="file-action-col">Action</th>
            </tr>
          </thead>
          <tbody>
            {files.map((file, index) => (
              <FileRow 
                key={index} 
                file={file} 
                onDownload={onDownload}
                onShare={onShare}
                onDelete={onDelete}
                isDeleting={deletingFiles.has(file)}
                isSharing={sharingFiles.has(file)}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default FileList;
