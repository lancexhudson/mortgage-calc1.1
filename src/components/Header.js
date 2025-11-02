import React from 'react';
import '../styles/Header.css';

const Header = ({ activeTab, setActiveTab }) => {
  return (
    <header className="header">
      <div className="header-inner">
        <h1 className="logo">Mortgage Calculator</h1>
        <nav className="nav">
          <button
            onClick={() => setActiveTab('afford')}
            className={`nav-btn ${
              activeTab === 'afford' || activeTab === 'mortgage' ? 'active' : ''
            }`}
          >
            Mortgage Calculator
          </button>
          <button
            onClick={() => setActiveTab('finder')}
            className={`nav-btn ${activeTab === 'finder' ? 'active' : ''}`}
          >
            Home Finder
          </button>
        </nav>
      </div>

      {(activeTab === 'afford' || activeTab === 'mortgage') && (
        <div className="tab-bar">
          <button
            onClick={() => setActiveTab('afford')}
            className={`tab-btn ${activeTab === 'afford' ? 'active' : ''}`}
          >
            What Can I Afford
          </button>
          <button
            onClick={() => setActiveTab('mortgage')}
            className={`tab-btn ${activeTab === 'mortgage' ? 'active' : ''}`}
          >
            Calculate Mortgage
          </button>
        </div>
      )}
    </header>
  );
};

export default Header;
