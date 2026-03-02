import React, { useState, useEffect, useContext } from 'react'
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
    '1 minute ago', '2 minutes ago', '3 minutes ago', '4 minutes ago', '5 minutes ago',
    '6 minutes ago', '7 minutes ago', '8 minutes ago', '9 minutes ago', '10 minutes ago',
    '11 minutes ago', '12 minutes ago', '13 minutes ago', '14 minutes ago', '15 minutes ago',
    '16 minutes ago', '17 minutes ago', '18 minutes ago', '19 minutes ago', '20 minutes ago',
    '21 minutes ago', '22 minutes ago', '23 minutes ago', '24 minutes ago', '25 minutes ago',
    '26 minutes ago', '27 minutes ago', '28 minutes ago', '29 minutes ago', '30 minutes ago',
    '31 minutes ago', '32 minutes ago', '33 minutes ago', '34 minutes ago', '35 minutes ago',
    '36 minutes ago', '37 minutes ago', '38 minutes ago', '39 minutes ago', '40 minutes ago',
    '41 minutes ago', '42 minutes ago', '43 minutes ago', '44 minutes ago', '45 minutes ago',
    '46 minutes ago', '47 minutes ago', '48 minutes ago', '49 minutes ago', '50 minutes ago',
    '51 minutes ago', '52 minutes ago', '53 minutes ago', '54 minutes ago', '55 minutes ago',
    '56 minutes ago', '57 minutes ago', '58 minutes ago', '59 minutes ago',
    '1 hour ago', '2 hours ago', '3 hours ago', '4 hours ago', '5 hours ago', '6 hours ago',
    '7 hours ago', '8 hours ago', '9 hours ago', '10 hours ago', '11 hours ago', '12 hours ago',
    '13 hours ago', '14 hours ago', '15 hours ago', '16 hours ago', '17 hours ago', '18 hours ago',
    '19 hours ago', '20 hours ago', '21 hours ago', '22 hours ago', '23 hours ago',
    '1 day ago', '2 days ago', '3 days ago', '4 days ago',
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
  const [loading, setLoading] = useState(true)

  // Generate reviews on component mount
  useEffect(() => {
    if (food_list && food_list.length > 0) {
      setReviews(generateRandomReviews(8))
      setLoading(false)
    }
  }, [food_list])

  // Function to get food size from food_list
  const getFoodSize = (foodName) => {
    if (!food_list || food_list.length === 0) return '';
    const foodItem = food_list.find(food => food.name === foodName);
    return foodItem?.size ? ` (${foodItem.size})` : '';
  }

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

  if (loading) {
    return (
      <div className='recent-reviews-section' id='recent-reviews'>
        <div className='reviews-header'>
          <h2>⭐ Recent Customer Reviews</h2>
          <p className='reviews-subtitle'>See what our customers love about us</p>
        </div>
        <div className='reviews-container'>
          <button className='scroll-btn left' onClick={() => scroll('left')} disabled>❮</button>
          <div className='reviews-scroll-container'>
            <div className='review-card'>
              <div className='review-header'>
                <div className='reviewer-info'>
                  <span className='avatar'>L</span>
                  <div className='reviewer-details'>
                    <h4 className='reviewer-name'>Loading...</h4>
                    <span className='review-time'>Just now</span>
                  </div>
                </div>
                <div className='star-rating'>
                  <span className='star filled'>★</span>
                  <span className='star filled'>★</span>
                  <span className='star filled'>★</span>
                  <span className='star filled'>★</span>
                  <span className='star filled'>★</span>
                  <span className='rating-text'>(5.0)</span>
                </div>
              </div>
              <p className='review-text'>"Loading reviews..."</p>
              <div className='review-food'>
                <span className='food-tag'>Loading...</span>
              </div>
              <button className='helpful-btn' disabled>👍 Helpful</button>
            </div>
          </div>
          <button className='scroll-btn right' onClick={() => scroll('right')} disabled>❯</button>
        </div>
        <button className='view-all-reviews' disabled>View All Reviews →</button>
      </div>
    )
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
                <span className='food-tag'>
                  {review.food}
                  {getFoodSize(review.food)}
                </span>
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
