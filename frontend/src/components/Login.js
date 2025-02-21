import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import LogService from '../services/LogService';
import './Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const navigate = useNavigate();

  const toggleForm = () => {
    setIsRegistering(!isRegistering);
    setError('');
    setMessage('');
    setEmail('');
    setPassword('');
  };

  const handleInputChange = (e, setter) => {
    setter(e.target.value);
    setError('');
    setMessage('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    
    try {
      if (isRegistering) {
        const response = await axios.post('http://localhost:5000/api/create-user', {
          email,
          password
        });
        setMessage(response.data.message);
        LogService.saveLog(email, 'kullanıcı kaydı', 'başarılı');
        setIsRegistering(false);
        setEmail('');
        setPassword('');
      } else {
        const response = await axios.post('http://localhost:5000/api/login', {
          email,
          password
        });

        localStorage.setItem('token', response.data.token);
        LogService.saveLog(email, 'giriş', 'başarılı');
        
        if (response.data.isAdmin) {
          navigate('/logs');
        } else {
          navigate('/dashboard');
        }
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'İşlem başarısız';
      setError(errorMessage);
      LogService.saveLog(
        email, 
        isRegistering ? 'kullanıcı kaydı' : 'giriş',
        'başarısız',
        'local'
      );
    }
  };

  return (
    <div className="container">
      <div className="row justify-content-center align-items-center min-vh-100">
        <div className="col-md-6 col-lg-4">
          <div className="card shadow">
            <div className="card-body">
              <h2 className="card-title text-center mb-4">
                {isRegistering ? 'Kayıt Ol' : 'Giriş Yap'}
              </h2>
              {error && (
                <div className="alert alert-danger" role="alert">
                  {error}
                </div>
              )}
              {message && (
                <div className="alert alert-success" role="alert">
                  {message}
                </div>
              )}
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <input
                    type="email"
                    className="form-control"
                    placeholder="Email Adresi"
                    value={email}
                    onChange={(e) => handleInputChange(e, setEmail)}
                  />
                </div>
                <div className="mb-3">
                  <input
                    type="password"
                    className="form-control"
                    placeholder="Şifre"
                    value={password}
                    onChange={(e) => handleInputChange(e, setPassword)}
                  />
                </div>
                <div className="d-grid gap-2">
                  <button type="submit" className="btn btn-primary">
                    {isRegistering ? 'Kayıt Ol' : 'Giriş Yap'}
                  </button>
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={toggleForm}
                  >
                    {isRegistering ? 'Giriş Yap' : 'Kayıt Ol'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login; 