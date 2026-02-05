import React, { useState, useContext, useEffect, useRef } from 'react'
import './Home.css'
import Header from '../../components/Header/Header'
import ExploreMenu from '../../components/ExploreMenu/ExploreMenu'
import FoodDisplay from '../../components/FoodDisplay/FoodDisplay'
import QRCode from '../../components/QRCode/QRCode'
import TrendingSection from '../../components/TrendingSection/TrendingSection'
// import AdvancedSearch from '../../components/AdvancedSearch/AdvancedSearch'
import PromotionalBanner from '../../components/PromotionalBanner/PromotionalBanner'
import LocationDeals from '../../components/LocationDeals/LocationDeals'
import RecentReviews from '../../components/RecentReviews/RecentReviews'
import PersonalizedRecommendations from '../../components/PersonalizedRecommendations/PersonalizedRecommendations'
import { StoreContext } from '../../context/StoreContext'
// import AppDownload from '../../components/AppDownload/AppDownload'

const Home = () => {
  const [category, setCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [priceFilter, setPriceFilter] = useState({ min: 0, max: 10000 });
  const [sortBy, setSortBy] = useState("popular");
  const [showTrending, setShowTrending] = useState(true);
  const { food_list, userLocation } = useContext(StoreContext);
  const isFirstRender = useRef(true);

  // Scroll to food display only when category changes (not on initial load)
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    
    const foodDisplayElement = document.getElementById('explore-menu');
    if (foodDisplayElement) {
      foodDisplayElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [category]);

  return (
    <div className='home-container'>
      <Header />
      
      {/* Advanced Search Section
      <AdvancedSearch 
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        priceFilter={priceFilter}
        setPriceFilter={setPriceFilter}
        sortBy={sortBy}
        setSortBy={setSortBy}
      /> */}

      {/* Promotional Banner */}
      <PromotionalBanner />

      {/* Trending Section */}
      {showTrending && food_list.length > 0 && (
        <TrendingSection 
          onClose={() => setShowTrending(false)}
        />
      )}

      {/* Location-based Deals */}
      {userLocation && <LocationDeals />}

      {/* Main Menu Section */}
      <div className='home-menu-section'>
        <ExploreMenu category={category} setCategory={setCategory} />
        <FoodDisplay 
          category={category}
          searchQuery={searchQuery}
          priceFilter={priceFilter}
          sortBy={sortBy}
        />
      </div>

      {/* Personalized Recommendations */}
      <PersonalizedRecommendations />

      {/* Recent Reviews Section */}
      <RecentReviews />

      {/* QR Code Section */}
      <QRCode />
      {/* <AppDownload /> */}
    </div>
  )
}

export default Home
