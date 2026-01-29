import React from 'react'
import './Navbar.css'
import { assets } from '../../assets/assets'
import { useAuth } from '../../context/AuthContext'
import { useNavigate } from 'react-router-dom'

const Navbar = () => {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  }

  const handleLogin = () => {
    window.dispatchEvent(new Event('showAdminLoginPopup'));
  }

  return (
    <div className='navbar'>
      <img className='logo' src={assets.logo} alt="" />
      <h1>  Admin Panel  </h1>
      {!isAuthenticated ? (
        <button onClick={handleLogin} className="login-btn">Sign In</button>
      ) : (
        <div className="navbar-profile">
          <img className='profile' src={assets.profile_image} alt="" />
          <ul className="nav-profile-dropdown">
            <li onClick={handleLogout}>
              <img src={assets.logout_icon} alt="" />
              <p>Logout</p>
            </li>
          </ul>
        </div>
      )}
    </div>
  )
}

export default Navbar
