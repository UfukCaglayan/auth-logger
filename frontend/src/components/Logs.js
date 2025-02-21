import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import LogService from '../services/LogService';
import './Logs.css';

const Logs = () => {
  const [logs, setLogs] = useState([]);
  const [localLogs, setLocalLogs] = useState([]);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('server'); // 'server' veya 'local'
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/login');
          return;
        }

        // Sunucu loglarını al
        const response = await axios.get('http://localhost:5000/api/logs', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setLogs(response.data);

        // Yerel logları al
        const localLogsData = LogService.getLocalLogs();
        setLocalLogs(localLogsData);

      } catch (error) {
        if (error.response?.status === 401 || error.response?.status === 403) {
          navigate('/login');
        } else {
          setError('Loglar yüklenirken hata oluştu');
        }
      }
    };

    fetchLogs();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'başarılı': return 'bg-success';
      case 'başarısız': return 'bg-danger';
      case 'şüpheli': return 'bg-warning';
      default: return 'bg-secondary';
    }
  };

  const clearLocalLogs = () => {
    LogService.clearLocalLogs();
    setLocalLogs([]);
  };

  return (
    <div className="container-fluid py-4">
      <div className="row mb-4">
        <div className="col d-flex justify-content-between align-items-center">
          <h2>Sistem Logları</h2>
          <div>
            <button 
              onClick={() => setActiveTab('server')} 
              className={`btn ${activeTab === 'server' ? 'btn-primary' : 'btn-outline-primary'} me-2`}
            >
              Sunucu Logları
            </button>
            <button 
              onClick={() => setActiveTab('local')} 
              className={`btn ${activeTab === 'local' ? 'btn-primary' : 'btn-outline-primary'} me-2`}
            >
              Yerel Loglar
            </button>
            {activeTab === 'local' && (
              <button onClick={clearLocalLogs} className="btn btn-warning me-2">
                Yerel Logları Temizle
              </button>
            )}
            <button onClick={handleLogout} className="btn btn-danger">
              Çıkış Yap
            </button>
          </div>
        </div>
      </div>

      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      <div className="table-responsive">
        <table className="table table-striped table-hover">
          <thead className="table-dark">
            <tr>
              <th>Email</th>
              <th>İşlem</th>
              <th>Durum</th>
              <th>IP Adresi</th>
              <th>Tarih</th>
            </tr>
          </thead>
          <tbody>
            {(activeTab === 'server' ? logs : localLogs).map((log) => (
              <tr key={log._id}>
                <td>{log.email}</td>
                <td>{log.action}</td>
                <td>
                  <span className={`badge ${getStatusBadgeClass(log.status)}`}>
                    {log.status}
                  </span>
                </td>
                <td>{log.ipAddress}</td>
                <td>{new Date(log.timestamp).toLocaleString('tr-TR')}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Logs; 