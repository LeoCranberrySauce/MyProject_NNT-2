import React, { useState } from 'react'
import './AdvancedSearch.css'

const AdvancedSearch = ({
  searchQuery,
  setSearchQuery,
  priceFilter,
  setPriceFilter,
  sortBy,
  setSortBy
}) => {
  const [showFilters, setShowFilters] = useState(false)

  const handlePriceChange = (type, value) => {
    setPriceFilter(prev => ({
      ...prev,
      [type]: parseInt(value)
    }))
  }

  return (
    <div className='advanced-search-container'>
      <div className='search-bar-wrapper'>
        <div className='search-input-group'>
          <input
            type='text'
            placeholder='🔍 Search for food, restaurants...'
            className='search-input'
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button className='search-btn'>Search</button>
        </div>

        <div className='search-controls'>
          <select
            className='sort-select'
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value='popular'>Most Popular</option>
            <option value='price-low'>Price: Low to High</option>
            <option value='price-high'>Price: High to Low</option>
            <option value='rating'>Highest Rated</option>
            <option value='newest'>Newest Items</option>
          </select>

          <button 
            className='filter-toggle'
            onClick={() => setShowFilters(!showFilters)}
          >
            ⚙️ Filters
          </button>
        </div>
      </div>

      {showFilters && (
        <div className='advanced-filters'>
          <div className='filter-group'>
            <label>Price Range</label>
            <div className='price-inputs'>
              <div className='price-input-wrapper'>
                <label>Min: ₱</label>
                <input
                  type='number'
                  value={priceFilter.min}
                  onChange={(e) => handlePriceChange('min', e.target.value)}
                  min='0'
                />
              </div>
              <span className='price-separator'>-</span>
              <div className='price-input-wrapper'>
                <label>Max: ₱</label>
                <input
                  type='number'
                  value={priceFilter.max}
                  onChange={(e) => handlePriceChange('max', e.target.value)}
                  min='0'
                />
              </div>
            </div>
            <input
              type='range'
              min='0'
              max='10000'
              value={priceFilter.max}
              onChange={(e) => handlePriceChange('max', e.target.value)}
              className='price-slider'
            />
          </div>

          <button 
            className='clear-filters-btn'
            onClick={() => {
              setSearchQuery('')
              setPriceFilter({ min: 0, max: 10000 })
              setSortBy('popular')
            }}
          >
            Clear All Filters
          </button>
        </div>
      )}
    </div>
  )
}

export default AdvancedSearch
