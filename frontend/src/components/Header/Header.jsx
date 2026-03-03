import React from 'react'
import './Header.css'

const Header = () => {
  return (
    <div className='header'>
      <div className="header-contents">
        <h1>Welcome to NNT Purple Food House</h1>
        <p>Your favorite meryenda in town!</p>
        <div className="header-buttons">
          <a href='#promotional-banner'><button>🚀 <br /> Promos and Trends</button></a>
          <a href='#explore-menu'><button>🥡 <br /> View Menu</button></a>
          <a href='#recent-reviews'><button>⭐ <br /> Reviews</button></a>
          <a href='#qr-code'><button>𖣯 <br /> QR Code</button></a>
          <a href='#footer'><button>📩 <br /> Contact Us</button></a>
        </div>
      </div>
    </div>
  )
}

export default Header
