import React, { useState, useEffect } from 'react'
import Navbar from './components/Navbar/Navbar'
import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home/Home'
import Cart from './pages/Cart/Cart'
import PlaceOrder from './pages/PlaceOrder/PlaceOrder'
import Footer from './components/Footer/Footer'
import LoginPopup from './components/LoginPopup/LoginPopup'
import Verify from './pages/Verify/Verify'
import MyOrders from './pages/MyOrders/MyOrders'
import QRCode from './components/QRCode/QRCode'
import MapDisplay from './pages/MapDisplay/MapDisplay'

const App = () => {

  const [showLogin, setShowLogin] = useState(false)

  useEffect(() => {
    const handleShowLoginPopup = () => {
      setShowLogin(true);
    };

    window.addEventListener('showLoginPopup', handleShowLoginPopup);

    return () => {
      window.removeEventListener('showLoginPopup', handleShowLoginPopup);
    };
  }, []);

  return (
    <>
      {showLogin ? <LoginPopup setShowLogin={setShowLogin} /> : <></>}
      <Navbar setShowLogin={setShowLogin} />
      <div className='app'>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/cart' element={<Cart />} />
          <Route path='/order' element={<PlaceOrder />} />
          <Route path='/verify' element={<Verify />} />
          <Route path='/my-orders' element={<MyOrders />} />
          <Route path='/qr-code' element={<QRCode />} />
          <Route path='/map' element={<MapDisplay />} />
        </Routes>
      </div>
      <Footer />
    </>

  )
}

export default App;
