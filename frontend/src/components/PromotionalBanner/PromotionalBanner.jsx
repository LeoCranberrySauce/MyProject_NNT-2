import React, { useState, useEffect } from 'react'
import './PromotionalBanner.css'

const PromotionalBanner = () => {
  const [banners, setBanners] = useState([
    {
      id: 1,
      title: '50% OFF',
      subtitle: 'On all orders above ₱500',
      code: 'FOOD50',
      discount: '50%',
      color: '#667eea'
    },
    {
      id: 2,
      title: 'Free Delivery',
      subtitle: 'For orders in Quezon City',
      code: 'FREEDLV',
      discount: 'FREE',
      color: '#f093fb'
    },
    {
      id: 3,
      title: 'Buy 1 Get 1',
      subtitle: 'On selected meryenda items',
      code: 'B1G1',
      discount: 'PROMO',
      color: '#fa709a'
    }
  ])

  const [currentBanner, setCurrentBanner] = useState(0)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentBanner(prev => (prev + 1) % banners.length)
    }, 6000)
    return () => clearInterval(timer)
  }, [banners.length])

  const copyCode = (code) => {
    navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const nextBanner = () => {
    setCurrentBanner(prev => (prev + 1) % banners.length)
  }

  const prevBanner = () => {
    setCurrentBanner(prev => (prev - 1 + banners.length) % banners.length)
  }

  const banner = banners[currentBanner]

  return (
    <div className='promotional-banner-wrapper' id="promotional-banner">
      <div
        className='promotional-banner'
        style={{ background: `linear-gradient(135deg, ${banner.color}20 0%, ${banner.color}10 100%)`, borderLeft: `4px solid ${banner.color}` }}
      >
        <div className='banner-content'>
          <div className='banner-text'>
            <h3 className='banner-title'>{banner.title}</h3>
            <p className='banner-subtitle'>{banner.subtitle}</p>
          </div>

          <div className='banner-actions'>
            <div className='promo-code-box'>
              <span className='promo-label'>Code:</span>
              <code className='promo-code'>{banner.code}</code>
              <button
                className='copy-btn'
                onClick={() => copyCode(banner.code)}
                title='Copy code'
              >
                {copied ? '✓ Copied!' : '📋 Copy'}
              </button>
            </div>

            <button className='claim-btn' style={{ backgroundColor: banner.color }}>
              Claim Now →
            </button>
          </div>
        </div>

        <div className='banner-nav'>
          <button className='banner-arrow' onClick={prevBanner}>❮</button>
          <div className='banner-dots'>
            {banners.map((_, index) => (
              <button
                key={index}
                className={`dot ${index === currentBanner ? 'active' : ''}`}
                onClick={() => setCurrentBanner(index)}
              />
            ))}
          </div>
          <button className='banner-arrow' onClick={nextBanner}>❯</button>
        </div>
      </div>
    </div>
  )
}

export default PromotionalBanner
