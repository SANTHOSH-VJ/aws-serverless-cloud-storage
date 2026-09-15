import React from 'react';

const Sidebar = ({ currentStorage = "—", storageLimit = "15 GB" }) => {
  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="logo-icon">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M17.5 19C19.9853 19 22 16.9853 22 14.5C22 12.1332 20.1793 10.2033 17.8693 10.0195C17.4116 6.61208 14.4754 4 11 4C7.13401 4 4 7.13401 4 11C4 11.2332 4.01138 11.4638 4.03348 11.6908C2.28589 12.2741 1 13.9782 1 16C1 18.2091 2.79086 20 5 20H17.5Z"/>
          </svg>
        </div>
        <h2>CloudSpace</h2>
      </div>

      <nav className="sidebar-nav">
        <a href="#!" className="nav-item">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
          Home
        </a>
        <a href="#!" className="nav-item active">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path></svg>
          My Files
        </a>
        <a href="#!" className="nav-item">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
          Recent
        </a>
        <a href="#!" className="nav-item">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
          Trash
        </a>
      </nav>

      <div className="sidebar-storage">
        <div className="storage-header">
          <span>STORAGE</span>
        </div>
        <div className="storage-info">
          {currentStorage !== "—" ? `${currentStorage} of ${storageLimit}` : "Storage usage unavailable"}
        </div>
        <div className="progress-bar-bg">
          <div className="progress-bar-fill" style={{ width: currentStorage !== "—" ? '10%' : '0%' }}></div>
        </div>
        <button className="upgrade-btn">Upgrade Storage</button>
      </div>
    </aside>
  );
};

export default Sidebar;
