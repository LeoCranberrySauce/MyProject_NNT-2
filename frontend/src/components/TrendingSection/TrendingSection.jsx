import React, { useState, useEffect } from 'react'
import './TrendingSection.css'

const TrendingSection = ({ onClose }) => {
  const [trendingItems, setTrendingItems] = useState([
    {
      id: 1,
      name: 'Spicy Lumpia',
      rating: 4.8,
      reviews: 324,
      trend: '↑ 45%',
      badge: '🔥 Trending'
    },
    {
      id: 2,
      name: 'Chicken BBQ',
      rating: 4.7,
      reviews: 298,
      trend: '↑ 38%',
      badge: '⭐ Popular'
    },
    {
      id: 3,
      name: 'Sinigang Pork',
      rating: 4.6,
      reviews: 267,
      trend: '↑ 32%',
      badge: '❤️ Loved'
    }
  ])

  const [activeIndex, setActiveIndex] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIndex(prev => (prev + 1) % trendingItems.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [trendingItems.length])

  return (
    <div className='trending-section' id='trending-section'>
      <div className='trending-header'>
        <h2>🚀 Trending Now</h2>
        <button className='close-trending' onClick={onClose}>✕</button>
      </div>

      <div className='trending-carousel'>
        {trendingItems.map((item, index) => (
          <div
            key={item.id}
            className={`trending-card ${index === activeIndex ? 'active' : ''}`}
          >
            <div className='trending-badge'>{item.badge}</div>
            <div className='trending-content'>
              <h3>{item.name}</h3>
              <div className='trending-stats'>
                <span className='rating'>⭐ {item.rating}</span>
                <span className='reviews'>({item.reviews} reviews)</span>
              </div>
              <div className='trending-growth'>{item.trend} this week</div>
              <button className='trending-btn'>View Item</button>
            </div>
          </div>
        ))}
      </div>

      <div className='trending-indicators'>
        {trendingItems.map((_, index) => (
          <button
            key={index}
            className={`indicator ${index === activeIndex ? 'active' : ''}`}
            onClick={() => setActiveIndex(index)}
          />
        ))}
      </div>
    </div>
  )
}

export default TrendingSection
