import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';

const Dashboard = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h2>Kullanıcı Paneli</h2>
        <button onClick={handleLogout} className="logout-button">Çıkış Yap</button>
      </div>
      <div className="dashboard-content">
        <h3>Hoş Geldiniz!</h3>
        <p>Bu sayfa normal kullanıcılar için dashboard sayfasıdır.</p>
      </div>
    </div>
  );
};

export default Dashboard; 