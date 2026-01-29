import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { toast } from 'react-toastify'
import { assets } from '../../assets/assets'
import './Login.css'

const Login = ({ url }) => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    userName: '',
    password: ''
  })

  useEffect(() => {
    // Check if already logged in
    const token = localStorage.getItem('adminToken')
    if (token) {
      navigate('/admin/dashboard')
    }
  }, [navigate])

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const response = await axios.post(`${url}/api/admin-user/login`, formData)
      if (response.data.success) {
        localStorage.setItem('adminToken', response.data.token)
        toast.success('Login successful!')
        navigate('/admin/dashboard')
      } else {
        toast.error(response.data.message || 'Login failed')
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error logging in')
    }
  }

  return (
    <div className="admin-login-page">
      <div className="admin-login-container">
        <div className="admin-login-left">
          <img src={assets.logo} alt="Logo" className="admin-login-logo" />
          <h1>Welcome Back!</h1>
          <p>Sign in to access the admin panel</p>
        </div>
        <div className="admin-login-right">
          <form onSubmit={handleSubmit} className="admin-login-form">
            <h2>Admin Login</h2>
            <div className="form-group">
              <label htmlFor="userName">Username</label>
              <input
                type="text"
                id="userName"
                name="userName"
                value={formData.userName}
                onChange={handleChange}
                required
                placeholder="Enter your username"
              />
            </div>
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                placeholder="Enter your password"
              />
            </div>
            <button type="submit" className="login-button">Sign In</button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Login 