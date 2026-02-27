import React, { useState, useEffect, useContext  } from 'react'
import './RecentReviews.css'
import { StoreContext } from '../../context/StoreContext'

const RecentReviews = () => {
  const { food_list } = useContext(StoreContext)

  // Sample data arrays for random generation
  const names = [
    'Maria Santos', 'Juan Dela Cruz', 'Sarah Vizcaya', 'Miguelito Chan',
    'Jess Ika Lee', 'David Rodrigo', 'Emilia A. Garcia', 'James Wilson',
    'Anna Martez', 'Roberto Guinto', 'Lisa Masa', 'Ken Nguyen',
    'Michelle Reyes', 'Danny Kim Roja', 'Jennifer Lupa', 'Christopher Brown',
    'Coco Nut Martin', 'Maria Dela Cruz', 'Curly Vizcaya', 'Jose Mario Tiyan',
    'Donaldo Tramp', 'Rodrigo Durante', 'Felix Pusa', 'Sofia Garcia', 'Liam Wilson',
    'Tanggol Monte Cristo', 'Rigor Duwag', 'Tomas Sayang', 'Fidel Clara Castro',
    'Mary Grace Popcorn', 'Ricky Mango', 'Fiona Gandara', 'Xiamen Lee', 'Carlos Mendoza', 
    'Emily Santos', 'Anthony Cruz', 'Olivia Garcia', 'Michael Wilson', 'Sophia Martez', 
    'David Guinto', 'Isabella Masa', 'James Nguyen', 'Mia Reyes', 'Daniel Kim Roja',
    'Charlotte Lupa', 'Christopher Brown', 'Amelia Nut Martin', 'Ethan Dela Cruz',
    'Ava Vizcaya', 'Alexander Tiyan'
  ]

  const reviewTexts = [
    'Absolutely delicious! The flavor is perfectly balanced and not too sweet. Will definitely order again!',
    'Best bubble tea in town! Fresh ingredients and great service. Highly recommend!',
    'Amazing taste and quality! The portion size is generous and worth every centavo.',
    'Love this place! Everything is always fresh and the staff is super friendly.',
    'My go-to spot for drinks! Never disappoints. The consistency is always on point.',
    'Incredible flavor! You can really taste the quality of the ingredients used.',
    'So refreshing and delicious! Perfect for a hot day. Can\'t get enough of it!',
    'Outstanding quality! The presentation is beautiful and the taste is even better.',
    'Fantastic experience! The drink was prepared perfectly and tasted amazing.',
    'Highly recommended! Great value for money and the taste is exceptional.',
    'Delicious and satisfying! This has become my favorite treat.',
    'Perfect blend of flavors! Not too sweet, just right. Love it!',
    'Excellent quality and taste! Will be coming back for more.',
    'Simply the best! Fresh, flavorful, and always consistent.',
    'Amazing product! Exceeded my expectations in every way.',
    'Top-notch quality! You can tell they use premium ingredients.'
  ]

  const timeOptions = [
    '5 minutes ago', '15 minutes ago', '30 minutes ago', '1 hour ago',
    '2 hours ago', '3 hours ago', '5 hours ago', '8 hours ago',
    '12 hours ago', '1 day ago', '2 days ago', '3 days ago', '4 days ago', 
    '5 days ago', '6 days ago', '7 days ago', '8 days ago', '9 days ago',
     '10 days ago', '1 week ago', '2 weeks ago', '3 weeks ago', '1 month ago',
      '2 months ago', '3 months ago', '4 months ago', '5 months ago',
       '6 months ago', '7 months ago', '8 months ago', '9 months ago',
        '10 months ago', '1 year ago', '2 years ago', '3 years ago'
  ]

  // Function to generate random reviews
  const generateRandomReviews = (count = 8) => {
    const generatedReviews = []
    const usedCombinations = new Set()

    for (let i = 0; i < count; i++) {
      let combination
      let attempts = 0
      
      // Try to create unique combinations
      do {
        const randomName = names[Math.floor(Math.random() * names.length)]
        const randomFood = food_list && food_list.length > 0
          ? food_list[Math.floor(Math.random() * food_list.length)].name
          : 'Bubble Tea'
        combination = `${randomName}-${randomFood}`
        attempts++
      } while (usedCombinations.has(combination) && attempts < 50)

      usedCombinations.add(combination)

      const [name, food] = combination.split('-')
      const rating = Math.random() > 0.3 ? 5 : (Math.random() > 0.5 ? 4.5 : 4) // Mostly 5 stars
      
      generatedReviews.push({
        id: i + 1,
        author: name,
        rating: rating,
        text: reviewTexts[Math.floor(Math.random() * reviewTexts.length)],
        food: food,
        avatar: name.charAt(0).toUpperCase(),
        time: timeOptions[Math.floor(Math.random() * timeOptions.length)]
      })
    }

    return generatedReviews
  }

  const [reviews, setReviews] = useState([])

  // Generate reviews on component mount
  useEffect(() => {
    setReviews(generateRandomReviews(8))
  }, [])

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
