import React, { useState, useEffect } from 'react'
import Navbar from './components/Navbar/Navbar'
import Sidebar from './components/Sidebar/Sidebar'
import { Routes, Route, Navigate } from 'react-router-dom'
//import Add from './pages/Add/Add'
import List from './pages/List/List'
import Orders from './pages/Orders/Orders'
import Dashboard from './pages/Dashboard/Dashboard'
import Categories from './pages/Categories/Categories'
import UsersList from './pages/UsersList/UsersList'
import EditCategory from './pages/EditCategory/EditCategory'
import EditFoodList from './pages/EditFoodList/EditFoodList'
import AdminUserList from './pages/AdminUserList/AdminUserList'
import AdminLogin from './components/AdminLogin/AdminLogin'
import ProtectedRoute from './components/ProtectedRoute'
import { AuthProvider } from './context/AuthContext'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const App = () => {
  const url = "http://localhost:4000"
  const [editCategory, setEditCategory] = useState(false)
  const [categoryToEdit, setCategoryToEdit] = useState(null)
  const [editFoodList, setEditFoodList] = useState(false)
  const [foodsToEdit, setFoodsToEdit] = useState(null)
  const [showAdminLogin, setShowAdminLogin] = useState(false)

  useEffect(() => {
    const handleAdminShowLoginPopup = () => {
      setShowAdminLogin(true);
    };

    window.addEventListener('showAdminLoginPopup', handleAdminShowLoginPopup);

    return () => {
      window.removeEventListener('showAdminLoginPopup', handleAdminShowLoginPopup);
    };
  }, []);

  return (
    <AuthProvider>
      {showAdminLogin && <AdminLogin />}
      <div>
        <ToastContainer />
        <Navbar />
        <hr />
        <div className='app-content'>
          <Sidebar />
          <Routes>
            <Route path='/' element={<Navigate to="/dashboard" replace />} />
            <Route path='/dashboard' element={
              <ProtectedRoute>
                <Dashboard url={url} />
              </ProtectedRoute>
            } />
            {/*<Route path='/add' element={<Add url={url} />} />*/}
            <Route path='/list' element={
              <ProtectedRoute>
                <>
                  <List
                    url={url}
                    setEditFoodList={setEditFoodList}
                    setFoodsToEdit={setFoodsToEdit}
                  />
                  {editFoodList && (
                    <EditFoodList
                      setEditFoodList={setEditFoodList}
                      foodsToEdit={foodsToEdit}
                    />
                  )}
                </>
              </ProtectedRoute>
            } />
            <Route path='/category' element={
              <ProtectedRoute>
                <>
                  <Categories
                    url={url}
                    setEditCategory={setEditCategory}
                    setCategoryToEdit={setCategoryToEdit}
                  />
                  {editCategory && (
                    <EditCategory
                      setEditCategory={setEditCategory}
                      categoryToEdit={categoryToEdit}
                    />
                  )}
                </>
              </ProtectedRoute>
            } />
            <Route path='/orders' element={
              <ProtectedRoute>
                <Orders url={url} />
              </ProtectedRoute>
            } />
            <Route path='/users' element={
              <ProtectedRoute>
                <UsersList url={url} />
              </ProtectedRoute>
            } />
            <Route path='/admin-users' element={
              <ProtectedRoute>
                <AdminUserList url={url} />
              </ProtectedRoute>
            } />
          </Routes>
        </div>
      </div>
    </AuthProvider>
  )
}

export default App
