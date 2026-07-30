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
        {userRole && userRole.toLowerCase() === 'staff' || userRole && userRole.toLowerCase() === 'cashier' && (
          <NavLink to='/pos' className='sidebar-option'>
            <img src={assets.pos_icon} alt="" />
            <p>POS (Cashier only)</p>
          </NavLink>
        )}
        <NavLink to='/list' className='sidebar-option'>
          <img src={assets.food_icon} alt="" />
          <p>Food List</p>
        </NavLink>
        <NavLink to='/category' className='sidebar-option'>
          <img src={assets.category_icon} alt="" />
          <p>Category</p>
        </NavLink>
        <NavLink to='/tables' className='sidebar-option'>
          <img src={assets.table_icon} alt="" />
          <p>Tables</p>
        </NavLink>
        <NavLink to='/reports' className='sidebar-option'>
          <img src={assets.dashboard_icon} alt="" />
          <p>Reports</p>
        </NavLink>
        <NavLink to='/inventory' className='sidebar-option'>
          <img src={assets.inventory_icon} alt="" />
          <p>Inventory</p>
        </NavLink>
        <NavLink to='/receipts' className='sidebar-option'>
          <img src={assets.receipt_icon} alt="" />
          <p>Receipts</p>
        </NavLink>
        <NavLink to='/orders' className='sidebar-option'>
          <img src={assets.order_icon} alt="" />
          <p>Orders</p>
        </NavLink>
        <NavLink to='/users' className='sidebar-option'>
          <img src={assets.customer_icon} alt="" />
          <p>Customers</p>
        </NavLink>
        {userRole && userRole.toLowerCase() === 'admin' && (
          <NavLink to='/admin-users' className='sidebar-option'>
            <img src={assets.admin_icon} alt="" />
            <p>Managers (Admin only)</p>
          </NavLink>
        )}
        {userRole && userRole.toLowerCase() === 'admin' && (
          <NavLink to='/promo-codes' className='sidebar-option'>
            <img src={assets.promo_icon} alt="" />
            <p>Promo Codes (Admin only)</p>
          </NavLink>
        )}
      </div>
    </div>
  )
}

export default Sidebar
