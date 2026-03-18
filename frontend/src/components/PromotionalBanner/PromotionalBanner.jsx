import React, { useState, useEffect, useContext } from 'react'
import './PromotionalBanner.css'
import { StoreContext } from '../../context/StoreContext'

const PromotionalBanner = () => {
  const { applyPromoCode, promoApplied, promoCode, fetchPromoCodes } = useContext(StoreContext);
  
  const [banners, setBanners] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const [currentBanner, setCurrentBanner] = useState(0)
  const [copied, setCopied] = useState(false)
  const [claimMessage, setClaimMessage] = useState('')

  // Fetch promo codes from backend
  const loadPromoCodes = async () => {
    try {
      setLoading(true)
      setError(null)
      
      // Fetch active promo codes from backend using StoreContext
      const promoData = await fetchPromoCodes()
      
      if (promoData) {
        // Transform promo codes into banner format
        const bannerData = promoData
          .filter(promo => promo.isActive && new Date(promo.expiresAt) > new Date())
          .map((promo, index) => {
            let title = ''
            let subtitle = ''
            let color = '#667eea'
            
            // Generate title and subtitle based on promo type
            if (promo.discountType === 'percentage') {
              title = `${promo.name}`
              subtitle = `${promo.description}`
              color = '#667eea'
            } else if (promo.discountType === 'fixed') {
              title = `${promo.name}`
              subtitle = `${promo.description}`
              color = '#f093fb'
            } else {
              title = 'Special Offer'
              subtitle = 'Check terms and conditions'
              color = '#fa709a'
            }
            
            return {
              id: promo._id,
              title: title,
              subtitle: subtitle,
              code: promo.code,
              discount: promo.discountType === 'percentage' ? `${promo.discountValue}%` : `₱${promo.discountValue}`,
              color: color,
              originalPromo: promo
            }
          })
        
        setBanners(bannerData)
      } else {
        setError('Failed to fetch promo codes')
      }
    } catch (err) {
      console.error('Error fetching promo codes:', err)
      setError('Error loading promo codes')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadPromoCodes()
  }, [])

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

  const handleClaim = () => {
    if (applyPromoCode(banner.code)) {
      setClaimMessage(`✓ ${banner.code} applied successfully!`)
      setTimeout(() => setClaimMessage(''), 3000)
    } else {
      setClaimMessage('Failed to apply promo code')
      setTimeout(() => setClaimMessage(''), 3000)
    }
  }

  // Show loading state
  if (loading) {
    return (
      <div className='promotional-banner-wrapper' id="promotional-banner">
        <div className='promotional-banner' style={{ background: 'linear-gradient(135deg, #f0f0f0 0%, #e0e0e0 100%)' }}>
          <div className='banner-content'>
            <div className='banner-text'>
              <h3 className='banner-title'>Loading Promotions...</h3>
              <p className='banner-subtitle'>Please wait while we fetch the latest offers</p>
            </div>
            <div className='banner-actions'>
              <div className='promo-code-box'>
                <span className='promo-label'>Code:</span>
                <code className='promo-code'>LOADING...</code>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Show error state
  if (error) {
    return (
      <div className='promotional-banner-wrapper' id="promotional-banner">
        <div className='promotional-banner' style={{ background: 'linear-gradient(135deg, #fff5f5 0%, #ffe6e6 100%)', borderLeft: '4px solid #dc3545' }}>
          <div className='banner-content'>
            <div className='banner-text'>
              <h3 className='banner-title' style={{ color: '#dc3545' }}>Unable to Load Promotions</h3>
              <p className='banner-subtitle' style={{ color: '#666' }}>{error}</p>
            </div>
            <div className='banner-actions'>
              <button 
                className='claim-btn' 
                style={{ backgroundColor: '#dc3545' }}
                onClick={fetchPromoCodes}
              >
                Retry
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Show empty state when no banners
  if (banners.length === 0) {
    return (
      <div className='promotional-banner-wrapper' id="promotional-banner">
        <div className='promotional-banner' style={{ background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)', borderLeft: '4px solid #6c757d' }}>
          <div className='banner-content'>
            <div className='banner-text'>
              <h3 className='banner-title' style={{ color: '#6c757d' }}>No Active Promotions</h3>
              <p className='banner-subtitle' style={{ color: '#666' }}>Check back later for new offers and discounts!</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className='promotional-banner-wrapper' id="promotional-banner">
      <div
        className='promotional-banner'
        style={{ 
          background: `linear-gradient(135deg, ${banner.color}20 0%, ${banner.color}10 100%)`, 
          borderLeft: `4px solid ${banner.color}`,
          opacity: promoApplied && promoCode === banner.code ? 0.8 : 1
        }}
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

            <button 
              className='claim-btn' 
              style={{ 
                backgroundColor: banner.color,
                opacity: promoApplied && promoCode === banner.code ? 0.6 : 1,
                cursor: promoApplied && promoCode === banner.code ? 'not-allowed' : 'pointer'
              }}
              onClick={handleClaim}
              disabled={promoApplied && promoCode === banner.code}
            >
              {promoApplied && promoCode === banner.code ? 'Already Applied' : 'Claim Now →'}
            </button>
          </div>
        </div>

        {claimMessage && (
          <div className="claim-message" style={{ 
            textAlign: 'center', 
            marginTop: '10px', 
            color: claimMessage.includes('successfully') ? '#28a745' : '#dc3545',
            fontSize: '14px',
            fontWeight: '600'
          }}>
            {claimMessage}
          </div>
        )}

        <div className='banner-dots'>
          {banners.map((_, index) => (
            <button
              key={index}
              className={`dot ${index === currentBanner ? 'active' : ''}`}
              onClick={() => setCurrentBanner(index)}
            />
          ))}
        </div>
        
      </div>
    </div>
  )
}

export default PromotionalBanner
