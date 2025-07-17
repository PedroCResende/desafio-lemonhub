import React from 'react';
import './Header.css';

const Header = ({ user, onLogout }) => {
  return (
    <header className="app-header">
      <div className="header-content">
        <h1 className="header-title">
          Cardápio Lemon<span className="hub">Hub</span>
        </h1>
        
        <div className="user-info">
          <span className="welcome-text">
            Bem-vindo, <strong>{user.username}</strong>!
          </span>
          <button 
            className="logout-button"
            onClick={onLogout}
          >
            Sair
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;

