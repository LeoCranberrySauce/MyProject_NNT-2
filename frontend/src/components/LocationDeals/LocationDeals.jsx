import React, { useContext } from 'react'
import './LocationDeals.css'
import { StoreContext } from '../../context/StoreContext'

const LocationDeals = () => {
  const { userLocation } = useContext(StoreContext)

  const locationDeals = [
    {
      id: 1,
      title: '30% OFF',
      location: 'Quezon City Area',
      description: 'Exclusive deals for QC residents',
      icon: '📍'
    },
    {
      id: 2,
      title: 'Free Delivery',
      location: '2km Radius',
      description: 'On orders ₱300 and above',
      icon: '🚚'
    },
    {
      id: 3,
      title: '₱50 Off',
      location: 'First Order',
      description: 'New customers in your area',
      icon: '🎉'
    }
  ]

  if (!userLocation) return null

  return (
    <div className='location-deals-container'>
      <div className='location-header'>
        <h3>📍 Location-Based Deals</h3>
        <p className='location-info'>
          Special offers for {userLocation.city || 'your area'}
        </p>
      </div>

      <div className='deals-grid'>
        {locationDeals.map(deal => (
          <div key={deal.id} className='deal-card'>
            <div className='deal-icon'>{deal.icon}</div>
            <h4 className='deal-title'>{deal.title}</h4>
            <p className='deal-location'>{deal.location}</p>
            <p className='deal-description'>{deal.description}</p>
            <button className='deal-btn'>Unlock Deal</button>
          </div>
        ))}
      </div>
    </div>
  )
}

export default LocationDeals
