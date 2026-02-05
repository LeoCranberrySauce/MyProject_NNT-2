import React, { useState, useEffect } from 'react'
import './RecentReviews.css'

const RecentReviews = () => {
  const [reviews, setReviews] = useState([
    {
      id: 1,
      author: 'Maria Santos',
      rating: 5,
      text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
      food: 'Winter Melon Milk Tea (22oz)',
      avatar: '👩‍🦰',
      time: '2 hours ago'
    }
  ])

  const [scrollPosition, setScrollPosition] = useState(0)

  const renderStars = (rating) => {
    return (
      <div className='star-rating'>
        {[...Array(5)].map((_, i) => (
          <span key={i} className={i < Math.floor(rating) ? 'star filled' : 'star'}>
            ★
          </span>
        ))}
        <span className='rating-text'>({rating.toFixed(1)})</span>
      </div>
    )
  }

  const scroll = (direction) => {
    const container = document.querySelector('.reviews-scroll-container')
    if (container) {
      const scrollAmount = 300
      container.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      })
    }
  }

  return (
    <div className='recent-reviews-section' id='recent-reviews'>
      <div className='reviews-header'>
        <h2>⭐ Recent Customer Reviews</h2>
        <p className='reviews-subtitle'>See what our customers love about us</p>
      </div>

      <div className='reviews-container'>
        <button className='scroll-btn left' onClick={() => scroll('left')}>❮</button>

        <div className='reviews-scroll-container'>
          {reviews.map(review => (
            <div key={review.id} className='review-card'>
              <div className='review-header'>
                <div className='reviewer-info'>
                  <span className='avatar'>{review.avatar}</span>
                  <div className='reviewer-details'>
                    <h4 className='reviewer-name'>{review.author}</h4>
                    <span className='review-time'>{review.time}</span>
                  </div>
                </div>
                {renderStars(review.rating)}
              </div>

              <p className='review-text'>"{review.text}"</p>

              <div className='review-food'>
                <span className='food-tag'>{review.food}</span>
              </div>

              <button className='helpful-btn'>👍 Helpful</button>
            </div>
          ))}
        </div>

        <button className='scroll-btn right' onClick={() => scroll('right')}>❯</button>
      </div>

      <button className='view-all-reviews'>View All Reviews →</button>
    </div>
  )
}

export default RecentReviews
