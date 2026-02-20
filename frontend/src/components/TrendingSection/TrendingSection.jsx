import React, { useState, useEffect, useContext } from 'react'
import './TrendingSection.css'
import { StoreContext } from '../../context/StoreContext'

const TrendingSection = ({ onClose }) => {
  const { food_list, url } = useContext(StoreContext)
  const [trendingItems, setTrendingItems] = useState([])
  const [activeIndex, setActiveIndex] = useState(0)

  useEffect(() => {
    // Get trending food items from the food list
    if (food_list && food_list.length > 0) {
      // Select random items or first few items as trending
      const trending = food_list.slice(0, 6).map((food, index) => ({
        id: food._id,
        name: `${food.name} (${food.size})`,
        price: food.price,
        image: food.image,
        description: food.description,
        category: food.category,
        rating: (4.5 + Math.random() * 0.5).toFixed(1), // Random rating between 4.5-5.0
        reviews: Math.floor(200 + Math.random() * 200), // Random reviews 200-400
        trend: `↑ ${Math.floor(30 + Math.random() * 20)}%`, // Random trend 30-50%
        badge: index === 0 ? '🔥 Trending' : index === 1 ? '⭐ Popular' : '❤️ Loved'
      }))
      setTrendingItems(trending)
    }
  }, [food_list])

  useEffect(() => {
    if (trendingItems.length > 0) {
      const timer = setInterval(() => {
        setActiveIndex(prev => (prev + 1) % trendingItems.length)
      }, 5000)
      return () => clearInterval(timer)
    }
  }, [trendingItems.length])

  return (
    <div className='trending-section' id='trending-section'>
      <div className='trending-header'>
        <h2>🚀 Trending Now</h2>
        <button className='close-trending' onClick={onClose}>✕</button>
      </div>

      <div className='trending-carousel'>
        {trendingItems.length > 0 ? (
          trendingItems.map((item, index) => (
            <div
              key={item.id}
              className={`trending-card ${index === activeIndex ? 'active' : ''}`}
            >
              <div className='trending-badge'>{item.badge}</div>
              {item.image && (
                <div className='trending-image'>
                  <img src={`${url}/images/${item.image}`} alt={item.name} />
                </div>
              )}
              <div className='trending-content'>
                <h3>{item.name}</h3>
                <p className='trending-category'>{item.category}</p>
                <p className='trending-price'>₱{item.price}</p>
                <div className='trending-stats'>
                  <span className='rating'>⭐ {item.rating}</span>
                  <span className='reviews'>({item.reviews} reviews)</span>
                </div>
                <div className='trending-growth'>{item.trend} this week</div>
                <button className='trending-btn'>View Item</button>
              </div>
            </div>
          ))
        ) : (
          <div className='trending-loading'>Loading trending items...</div>
        )}
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
