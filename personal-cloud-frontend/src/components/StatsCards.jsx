import React from 'react';

const StatsCards = ({ totalFiles }) => {
  return (
    <div className="stats-grid">
      <div className="stat-card">
        <div className="stat-info">
          <span className="stat-label">TOTAL FILES</span>
          <span className="stat-value">{totalFiles}</span>
        </div>
        <div className="stat-icon icon-blue">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"></path><polyline points="13 2 13 9 20 9"></polyline></svg>
        </div>
      </div>

      <div className="stat-card">
        <div className="stat-info">
          <span className="stat-label">ACTIVE FOLDERS</span>
          <span className="stat-value">—</span>
        </div>
        <div className="stat-icon icon-orange">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path></svg>
        </div>
      </div>

      <div className="stat-card">
        <div className="stat-info">
          <span className="stat-label">SHARED ITEMS</span>
          <span className="stat-value">—</span>
        </div>
        <div className="stat-icon icon-green">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg>
        </div>
      </div>
    </div>
  );
};

export default StatsCards;
