import React, { useContext } from 'react'
import './PersonalizedRecommendations.css'
import { StoreContext } from '../../context/StoreContext'

const PersonalizedRecommendations = () => {
  const { food_list, cartItems, url } = useContext(StoreContext)

  // Get personalized recommendations based on cart items
  const getRecommendations = () => {
    const carted = Object.keys(cartItems).filter(itemId => cartItems[itemId] > 0)

    if (carted.length === 0) {
      // Show random items if cart is empty
      return food_list.slice(0, 4)
    }

    // Get categories from carted items
    const cartedCategories = new Set()
    carted.forEach(itemId => {
      const item = food_list.find(f => f._id === itemId)
      if (item) cartedCategories.add(item.category)
    })

    // Recommend items from same categories
    const recommendations = food_list
      .filter(item => !carted.includes(item._id) && cartedCategories.has(item.category))
      .slice(0, 4)

    return recommendations.length > 0 ? recommendations : food_list.slice(0, 4)
  }

  const recommendations = getRecommendations()

  if (recommendations.length === 0) return null

  return (
    <div className='personalized-recommendations'>
      <div className='recommendations-header'>
        <h2>💡 Recommended For You</h2>
        <p className='recommendations-subtitle'>Based on your preferences</p>
      </div>

      <div className='recommendations-grid'>
        {recommendations.map(item => (
          <div key={item._id} className='recommendation-card'>
            <div className='rec-image-wrapper'>
              <img src={url + "/images/" + item.image} alt={item.name} className='rec-image' />
              <div className='rec-badge'>✨ For You</div>
            </div>

            <div className='rec-content'>
              <h3 className='rec-name'>{item.name} {item.size && `(${item.size})`}</h3>
              <p className='rec-description'>{item.description.substring(0, 50)}...</p>

              <div className='rec-meta'>
                <span className='rec-category'>{item.category}</span>
                <span className='rec-stock'>Stock: {item.stock}</span>
              </div>

              <div className='rec-footer'>
                <span className='rec-price'>₱{item.price}</span>
                <button className='rec-add-btn'>Add to Cart</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default PersonalizedRecommendations
