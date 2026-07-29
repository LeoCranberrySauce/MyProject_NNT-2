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
  const [currState, setCurrState] = useState("Login");
  const [data, setData] = useState({
    name: "",
    userName: "",
    role: "",
    address: "",
    phone: "",
    email: "",
    password: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const adminUserRoles = ["Admin", "Staff", "Cashier"];

  useEffect(() => {
    const handleShowLoginPopup = () => {
      setShowLogin(true);
      setCurrState("Login");
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

  const onAdminSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');

    try {
      let response;

      if (currState === "Login") {
        response = await axios.post(`${url}/api/admin-user/login`, {
          userName: data.userName,
          password: data.password
        });
      } else {
        if (!data.name || !data.userName || !data.role || !data.address || !data.phone || !data.email || !data.password) {
          setError("Please fill in all required fields");
          setLoading(false);
          return;
        }

        response = await axios.post(`${url}/api/admin-user/register`, {
          name: data.name,
          userName: data.userName,
          role: data.role,
          address: data.address,
          phone: Number(data.phone),
          email: data.email,
          password: data.password
        });
      }

      if (response.data.success) {
        login(response.data.token);
        setShowLogin(false);
        navigate('/dashboard');
      } else {
        setError(response.data.message || (currState === "Login" ? 'Login failed' : 'Registration failed'));
      }
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  const switchState = (state) => {
    setCurrState(state);
    setError('');
    setData({
      name: "",
      userName: "",
      role: "",
      address: "",
      phone: "",
      email: "",
      password: ""
    });
  }

  if (!showLogin) return null;

  return (
    <div className='admin-login-popup'>
      <div className="admin-login-popup-overlay" onClick={() => setShowLogin(false)}></div>
      <form onSubmit={onAdminSubmit} className="admin-login-popup-container">
        <div className="admin-login-popup-title">
          <h2>{currState === "Login" ? "ADMIN LOGIN" : "ADMIN SIGN UP"}</h2>
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
          {currState === "Sign Up" && (
            <>
              <input 
                name='name' 
                onChange={onChangeHandler} 
                value={data.name} 
                type="text" 
                placeholder='Your full name' 
                required 
                disabled={loading}
              />
              <input 
                name='address' 
                onChange={onChangeHandler} 
                value={data.address} 
                type="text" 
                placeholder='Your address' 
                required 
                disabled={loading}
              />
              <div className="multi-fields">
                <input 
                  name='phone' 
                  onChange={onChangeHandler} 
                  value={data.phone} 
                  type="tel" 
                  placeholder='Phone number' 
                  required 
                  disabled={loading}
                />
                <input 
                  name='email' 
                  onChange={onChangeHandler} 
                  value={data.email} 
                  type="email" 
                  placeholder='Your email' 
                  required 
                  disabled={loading}
                />
              </div>
              <select onChange={onChangeHandler} name='role' value={data.role} disabled={loading} required>
                <option value="">Select Role</option>
                {adminUserRoles.map((type) => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </>
          )}
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
            placeholder='Give password (min 8 characters)' 
            required 
            disabled={loading}
          />
        </div>
        <button type='submit' disabled={loading}>
          {loading 
            ? (currState === "Login" ? 'LOGGING IN...' : 'SIGNING UP...') 
            : (currState === "Login" ? 'LOGIN' : 'SIGN UP')
          }
        </button>

        {currState === "Login"
          ? <p className="admin-login-toggle-text">Want to join our business? <span onClick={() => switchState("Sign Up")}>Recruit Here.</span></p>
          : <p className="admin-login-toggle-text">Already have an account? <span onClick={() => switchState("Login")}>Login here</span></p>
        }
      </form>
    </div>
  )
}

export default AdminLogin