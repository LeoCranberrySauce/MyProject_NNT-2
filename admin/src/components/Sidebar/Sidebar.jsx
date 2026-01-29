import React from 'react'
import './Sidebar.css'
import { assets } from '../../assets/assets'
import { NavLink } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

const Sidebar = () => {
  const { getUserRole } = useAuth();
  const userRole = getUserRole();

  return (
    <div className='sidebar'>
      <div className='sidebar-options'>

        <NavLink to='/dashboard' className='sidebar-option'>
          <img src={assets.dashboard_icon} alt="" />
          <p>Dashboard</p>
        </NavLink>
        <NavLink to='/list' className='sidebar-option'>
          <img src={assets.order_icon} alt="" />
          <p>Food List</p>
        </NavLink>
        <NavLink to='/category' className='sidebar-option'>
          <img src={assets.order_icon} alt="" />
          <p>Category</p>
        </NavLink>
        <NavLink to='/orders' className='sidebar-option'>
          <img src={assets.order_icon} alt="" />
          <p>Orders</p>
        </NavLink>
        <NavLink to='/users' className='sidebar-option'>
          <img src={assets.order_icon} alt="" />
          <p>Customers</p>
        </NavLink>
        {userRole && userRole.toLowerCase() === 'admin' && (
          <NavLink to='/admin-users' className='sidebar-option'>
            <img src={assets.order_icon} alt="" />
            <p>Managers</p>
          </NavLink>
        )}
      </div>
    </div>
  )
}

export default Sidebar
