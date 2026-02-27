import React, { useContext, useMemo } from 'react'
import './FoodDisplay.css'
import { StoreContext } from '../../context/StoreContext'
import FoodItem from '../FoodItem/FoodItem'

// Category to icon mapping
const categoryIcons = {
  "All": "🥡",
  "Beverages": "🥤",
  "Iced Coffee": "🧊☕",
  "Tea": "🍵",
  "Fruit Tea": "🍹",
  "Milk Tea": "🧋",
  "Soda": "🥤",
  "Shakes": "🥛🍨",
  "Yoghurt": "🥛",
  "Yogurt": "🥛",
  "Fruit Soda": "🍸",
  "Frappe": "☕",
  "Food": "🍔",
  "Takoyaki": "🦑",
  "Pizza": "🍕",
  "Desserts": "🍰",
  "Snacks": "🍿",
  "Healthy": "🥗",
  "Vegan": "🌱",
  "Spicy": "🌶️",
  "Sweet": "🍬",
  "Savory": "🧂",
  "Hot": "🔥",
  "Cold": "❄️",
  "New": "🆕",
  "Popular": "⭐",
  "Recommended": "🎯",
  "Special": "✨"
}

const FoodDisplay = ({
  category,
  searchQuery = '',
  priceFilter = { min: 0, max: 10000 },
  sortBy = 'popular'
}) => {
  const { food_list } = useContext(StoreContext)

  // Filter and sort items
  const filteredItems = useMemo(() => {
    let items = food_list.filter(item => {
      // Category filter
      const categoryMatch = category === "All" || category === item.category

      // Search filter
      const searchMatch = searchQuery === '' ||
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase())

      // Price filter
      const priceMatch = item.price >= priceFilter.min && item.price <= priceFilter.max

      return categoryMatch && searchMatch && priceMatch
    })

    // Sorting
    switch (sortBy) {
      case 'price-low':
        items.sort((a, b) => a.price - b.price)
        break
      case 'price-high':
        items.sort((a, b) => b.price - a.price)
        break
      case 'rating':
        items.sort((a, b) => (b.rating || 0) - (a.rating || 0))
        break
      case 'newest':
        items.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0))
        break
      case 'popular':
      default:
        items.sort((a, b) => (b.orders || 0) - (a.orders || 0))
    }

    return items
  }, [food_list, category, searchQuery, priceFilter, sortBy])

  return (
    <div className='food-display' id='food-display'>
      <div className='food-display-header'>
        <h2>{categoryIcons[category] || "🥡"} {category === "All" ? "All Categories" : category}</h2>
        <span className='items-count'>({filteredItems.length} items)</span>
      </div>

      {filteredItems.length === 0 ? (
        <div className='no-results'>
          <p>😞 No items found matching your criteria</p>
          <p className='no-results-hint'>Try adjusting your filters or search query</p>
        </div>
      ) : (
        <div className="food-display-list">
          {filteredItems.map((item, index) => (
            <FoodItem
              key={item._id}
              id={item._id}
              name={item.name}
              description={item.description}
              price={item.price}
              size={item.size}
              image={item.image}
              stock={item.stock}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default FoodDisplay
