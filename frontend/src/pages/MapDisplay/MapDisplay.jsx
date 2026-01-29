import React, { useState, useEffect, useContext } from 'react';
import { StoreContext } from '../../context/StoreContext';
import Map from '../../components/Map/Map';
import './MapDisplay.css';

const MapDisplay = () => {
  const {
    userLocation,
    restaurantLocations,
    deliveryAddress,
    orderDeliveryLocation,
    getUserLocation,
    fetchNearbyRestaurants,
    saveDeliveryAddress,
    getDeliveryLocation,
    updateDeliveryLocation,
  } = useContext(StoreContext);

  const [loading, setLoading] = useState(false);
  const [mapType, setMapType] = useState('restaurants'); // 'restaurants' or 'delivery'
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [deliveryMode, setDeliveryMode] = useState(false);
  const [orderId, setOrderId] = useState('');
  const [address, setAddress] = useState('');
  const [mapCenter, setMapCenter] = useState(null);
  const [pollingInterval, setPollingInterval] = useState(null);

  // Get user location on component mount
  useEffect(() => {
    handleGetLocation();
  }, []);

  const handleGetLocation = async () => {
    setLoading(true);
    try {
      const location = await getUserLocation();
      setMapCenter([location.lat, location.lng]);
    } catch (error) {
      alert('Unable to get your location. Please enable location permission.');
    } finally {
      setLoading(false);
    }
  };

  const handleFindNearbyRestaurants = async () => {
    if (!userLocation) {
      alert('Please enable location access first');
      return;
    }

    setLoading(true);
    try {
      await fetchNearbyRestaurants(userLocation.lat, userLocation.lng, 5);
      setMapType('restaurants');
    } catch (error) {
      alert('Error fetching nearby restaurants');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveDeliveryAddress = async () => {
    if (!address) {
      alert('Please enter an address');
      return;
    }

    if (!mapCenter || mapCenter.length < 2) {
      alert('Please select a location on the map');
      return;
    }

    setLoading(true);
    try {
      await saveDeliveryAddress(address, mapCenter[0], mapCenter[1]);
      alert('Delivery address saved successfully!');
    } catch (error) {
      alert('Error saving delivery address');
    } finally {
      setLoading(false);
    }
  };

  const handleStartDeliveryTracking = async () => {
    if (!orderId) {
      alert('Please enter an order ID');
      return;
    }

    if (!userLocation) {
      alert('Please enable location access first');
      return;
    }

    setLoading(true);
    try {
      // First, get the current delivery location
      const deliveryLoc = await getDeliveryLocation(orderId);
      
      if (deliveryLoc) {
        // If delivery location exists, center map on it
        setMapCenter([deliveryLoc.lat, deliveryLoc.lng]);
      } else {
        // Otherwise, center on user location
        setMapCenter([userLocation.lat, userLocation.lng]);
      }

      setMapType('delivery');
      setDeliveryMode(true);
      alert('Delivery tracking started!');

      // Start polling for updates every 5 seconds
      const interval = setInterval(async () => {
        try {
          await updateDeliveryLocation(orderId, userLocation.lat, userLocation.lng);
        } catch (error) {
          console.log('Error polling delivery location:', error);
        }
      }, 5000);

      setPollingInterval(interval);
    } catch (error) {
      alert('Error starting delivery tracking: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Cleanup polling on unmount or delivery mode change
  useEffect(() => {
    return () => {
      if (pollingInterval) {
        clearInterval(pollingInterval);
      }
    };
  }, [pollingInterval]);

  return (
    <div className="map-display-container">
      <div className="map-display-content">
        {/* Header */}
        <div className="map-header">
          <h1>🗺️ Restaurant & Delivery Map</h1>
          <p>Find restaurants and track your deliveries</p>
        </div>

        {/* Controls Section */}
        <div className="map-controls">
          <div className="control-group">
            <button
              className={`control-btn ${mapType === 'restaurants' ? 'active' : ''}`}
              onClick={() => setMapType('restaurants')}
            >
              🏪 Restaurants
            </button>
            <button
              className={`control-btn ${mapType === 'delivery' ? 'active' : ''}`}
              onClick={() => setMapType('delivery')}
            >
              🚚 Delivery Tracking
            </button>
            <button className="control-btn secondary" onClick={handleGetLocation}>
              📍 Get My Location
            </button>
          </div>
        </div>

        <div className="map-main-content">
          {/* Map Section */}
          <div className="map-section">
            {loading && <div className="loading-overlay">Loading...</div>}
            <Map
              userLocation={userLocation}
              restaurantLocations={
                mapType === 'restaurants' ? restaurantLocations : []
              }
              deliveryAddress={deliveryMode ? deliveryAddress : null}
              orderLocation={mapType === 'delivery' ? orderDeliveryLocation : null}
              zoom={13}
              className="main-map"
            />
          </div>

          {/* Sidebar Section */}
          <div className="map-sidebar">
            {mapType === 'restaurants' ? (
              <div className="sidebar-content">
                <h2>Find Restaurants</h2>

                <div className="sidebar-section">
                  <button
                    className="btn btn-primary full-width"
                    onClick={handleFindNearbyRestaurants}
                    disabled={loading}
                  >
                    🔍 Find Nearby Restaurants
                  </button>
                </div>

                <div className="sidebar-section">
                  <h3>Restaurant List</h3>
                  {restaurantLocations && restaurantLocations.length > 0 ? (
                    <div className="restaurant-list">
                      {restaurantLocations.map((restaurant, index) => (
                        <div
                          key={index}
                          className={`restaurant-card ${
                            selectedRestaurant === index ? 'active' : ''
                          }`}
                          onClick={() => setSelectedRestaurant(index)}
                        >
                          <h4>{restaurant.name}</h4>
                          <p className="address">{restaurant.address}</p>
                          {restaurant.rating && (
                            <p className="rating">⭐ {restaurant.rating}</p>
                          )}
                          {restaurant.deliveryTime && (
                            <p className="delivery-time">
                              ⏱️ {restaurant.deliveryTime} mins
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="empty-message">
                      No restaurants found. Click "Find Nearby Restaurants" to search.
                    </p>
                  )}
                </div>

                <div className="sidebar-section">
                  <h3>Delivery Address</h3>
                  <input
                    type="text"
                    placeholder="Enter delivery address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="input-field"
                  />
                  <button
                    className="btn btn-secondary full-width"
                    onClick={handleSaveDeliveryAddress}
                    disabled={loading}
                  >
                    💾 Save Address
                  </button>
                </div>
              </div>
            ) : (
              <div className="sidebar-content">
                <h2>Delivery Tracking</h2>

                <div className="sidebar-section">
                  <label>Order ID</label>
                  <input
                    type="text"
                    placeholder="Enter your order ID"
                    value={orderId}
                    onChange={(e) => setOrderId(e.target.value)}
                    className="input-field"
                  />
                  <button
                    className="btn btn-primary full-width"
                    onClick={handleStartDeliveryTracking}
                    disabled={loading}
                  >
                    🚚 Start Tracking
                  </button>
                </div>

                {deliveryMode && orderDeliveryLocation && (
                  <div className="sidebar-section">
                    <h3>Current Delivery Location</h3>
                    <div className="location-info">
                      <p>
                        <strong>Latitude:</strong> {orderDeliveryLocation.lat.toFixed(4)}
                      </p>
                      <p>
                        <strong>Longitude:</strong>{' '}
                        {orderDeliveryLocation.lng.toFixed(4)}
                      </p>
                      <p>
                        <strong>Status:</strong> {orderDeliveryLocation.name}
                      </p>
                    </div>
                  </div>
                )}

                {deliveryAddress && (
                  <div className="sidebar-section">
                    <h3>Delivery Address</h3>
                    <div className="location-info">
                      <p>{deliveryAddress.address}</p>
                      <p>
                        Lat: {deliveryAddress.lat.toFixed(4)}, Lng:{' '}
                        {deliveryAddress.lng.toFixed(4)}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* User Location Info */}
            {userLocation && (
              <div className="sidebar-section user-location">
                <h3>Your Location</h3>
                <div className="location-info">
                  <p>
                    <strong>Latitude:</strong> {userLocation.lat.toFixed(4)}
                  </p>
                  <p>
                    <strong>Longitude:</strong> {userLocation.lng.toFixed(4)}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapDisplay;
