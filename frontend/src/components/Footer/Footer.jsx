import React, { useContext, useState, useEffect } from 'react'
import './Footer.css'
import { assets } from '../../assets/assets'
import { Link } from 'react-router-dom'

const Footer = () => {

    const [menu, setMenu] = useState(window.location.pathname === '/' ? "home" : "menu");

    useEffect(() => {
        // Update menu state based on current route
        if (location.pathname === '/') {
            setMenu("home");
        } else if (location.pathname === '/about-us') {
            setMenu("about-us");
        } else if (location.pathname === '/map') {
            setMenu("map");
        } else if (location.pathname === '/cart') {
            setMenu("cart");
        } else {
            setMenu("menu");
        }
    }, [location.pathname]);

    return (
        <div className='footer' id='footer'>
            <div className="footer-content">
                <div className="footer-content-left">
                    <img src={assets.logo} alt="" className="footer-logo" />
                    <p>Delicious food delivered to your doorstep. Waynu Food Stall offers a wide variety of cuisines to satisfy your cravings.</p>
                    <div className="footer-app-downloads">
                        <h2>You can download these on your mobile phones!</h2>
                        <div className="footer-store-links">
                            <a href="#">
                                <img src={assets.app_store} alt="App Store" />
                            </a>
                            <a href="#">
                                <img src={assets.play_store} alt="Play Store" />
                            </a>
                        </div>
                    </div>
                </div>
                <div className="footer-content-links">
                    <h2>QUICK LINKS</h2>
                    <ul>
                        <li>
                            <Link to='/' onClick={() => {
                                setMenu("home");
                                if (location.pathname === '/about-us' || location.pathname === '/map' || location.pathname === '/cart') {
                                    window.scrollTo({ top: 0, behavior: 'instant' });
                                } else {
                                    window.scrollTo({ top: 0, behavior: 'smooth' });
                                }
                            }} className={menu === "home" ? "active" : ""}>Home</Link>
                        </li>
                        <li>
                            <Link to="/#explore-menu" onClick={() => {
                                setMenu("menu");
                                window.scrollTo({ top: 0, behavior: 'smooth' });
                            }} className={menu === "menu" ? "active" : ""}>Menu</Link>
                        </li>
                        <li>
                            <Link to='/cart' onClick={() => {
                                setMenu("cart");
                                window.scrollTo({ top: 0, behavior: 'instant' });
                            }} className={menu === "cart" ? "active" : ""}>Cart</Link>
                        </li>
                    </ul>
                </div>
                <div className="footer-content-center">
                    <h2>COMPANY</h2>
                    <ul>
                        <li>
                            <Link to='/' onClick={() => {
                                setMenu("home");
                                if (location.pathname === '/about-us' || location.pathname === '/map' || location.pathname === '/cart') {
                                    window.scrollTo({ top: 0, behavior: 'instant' });
                                } else {
                                    window.scrollTo({ top: 0, behavior: 'smooth' });
                                }
                            }} className={menu === "home" ? "active" : ""}>Home</Link>
                        </li>
                        <li>
                            <Link to='/about-us' onClick={() => {
                                setMenu("about-us");
                                window.scrollTo({ top: 0, behavior: 'instant' });
                            }} className={menu === "about-us" ? "active" : ""}>About Us</Link>
                        </li>
                        <li>Privacy Policy</li>
                    </ul>
                </div>
                <div className="footer-content-right">
                    <h2>GET IN TOUCH</h2>
                    <ul>
                        <li><i className="fas fa-map-marker-alt"></i> Ili-likha Artist Village, Assumption Road, Baguio City, Philippines, 2600 </li>
                        <li><i className="fas fa-phone"></i> 0915 243 9319 </li>
                        <li><i className="fas fa-envelope"></i> waynufood@gmail.com </li>
                    </ul>
                    <h2>SOCIAL MEDIA ACCOUNTS</h2>
                    <div className="footer-social-icons">
                        <a href="https://www.facebook.com/waynuili" target="_blank" rel="noopener noreferrer">
                            <img src={assets.facebook_icon} alt="https://www.facebook.com/waynuili" />
                        </a>
                        <img src={assets.twitter_icon} alt="https://twitter.com" />
                        <img src={assets.linkedin_icon} alt="https://www.linkedin.com" />
                    </div>
                </div>
            </div>
            <hr />
            <p className="footer-copyright">&copy; {new Date().getFullYear()} Waynu Food Stall. All rights reserved. This food stall is afiliated with Purple Blend Franchise.</p>
        </div>
    )
}

export default Footer
