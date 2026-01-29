import React, { useState, useEffect } from 'react'
import './AdminLogin.css'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

const AdminLogin = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const url = "http://localhost:4000";
  const [showLogin, setShowLogin] = useState(false);
  const [data, setData] = useState({
    userName: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const handleShowLoginPopup = () => {
      setShowLogin(true);
    };

    window.addEventListener('showAdminLoginPopup', handleShowLoginPopup);

    return () => {
      window.removeEventListener('showAdminLoginPopup', handleShowLoginPopup);
    };
  }, []);

  const onChangeHandler = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setData(prev => ({ ...prev, [name]: value }));
    setError('');
  }

  const onAdminLogin = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await axios.post(`${url}/api/admin-user/login`, data);

      if (response.data.success) {
        login(response.data.token);
        setShowLogin(false);
        navigate('/dashboard');
      } else {
        setError(response.data.message || 'Login failed');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred during login');
    } finally {
      setLoading(false);
    }
  }

  if (!showLogin) return null;

  return (
    <div className='admin-login-popup'>
      <div className="admin-login-popup-overlay" onClick={() => setShowLogin(false)}></div>
      <form onSubmit={onAdminLogin} className="admin-login-popup-container">
        <div className="admin-login-popup-title">
          <h2>ADMIN LOGIN</h2>
          <button 
            type="button" 
            className="close-button" 
            onClick={() => setShowLogin(false)}
          >
            ×
          </button>
        </div>
        {error && <div className="error-message">{error}</div>}
        <div className="admin-login-popup-inputs">
          <input 
            name='userName' 
            onChange={onChangeHandler} 
            value={data.userName} 
            type="text" 
            placeholder='Your username' 
            required 
            disabled={loading}
          />
          <input 
            name='password' 
            onChange={onChangeHandler} 
            value={data.password} 
            type="password" 
            placeholder='Give password' 
            required 
            disabled={loading}
          />
        </div>
        <button type='submit' disabled={loading}>
          {loading ? 'LOGGING IN...' : 'LOGIN'}
        </button>
      </form>
    </div>
  )
}

export default AdminLogin
