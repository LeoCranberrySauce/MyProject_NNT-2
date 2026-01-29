import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import './Map.css';

// Fix for default markers
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom icons
const userIcon = L.icon({
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const restaurantIcon = L.icon({
  iconUrl: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0Ij48cGF0aCBmaWxsPSIjRkY2QjZCIiBkPSJNMTEgOXYzSDhWOWgzem0wLTdINVY0aDZWMnptMTMgMGgtNXYyaDF2MWgzVjJ6bTAtMmgtMXYyaDF2LTJ6bTAtMWgtNXYyaDF2LTJ6bS02IDV2Mkg4djNoNnptMyA1djJoMnYtMnptMjAgMGgtMnYyaDJ2LTJ6TTEyIDJ2M2gtMlYyaDF6bTktN3YyaDJ2LTJ6Ii8+PC9zdmc+',
  iconSize: [25, 25],
  iconAnchor: [12, 12],
  popupAnchor: [1, -34],
});

const deliveryIcon = L.icon({
  iconUrl: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0Ij48cGF0aCBmaWxsPSIjNDJBNUY1IiBkPSJNMjAgMTZWNHEwLTEuMjUtLjkzOC0yLjEyNVQ=Ii8+PC9zdmc+',
  iconSize: [25, 25],
  iconAnchor: [12, 12],
  popupAnchor: [1, -34],
});

const MapUpdater = ({ center, zoom }) => {
  const map = useMap();
  
  useEffect(() => {
    if (center && center[0] && center[1]) {
      map.setView(center, zoom || 13);
    }
  }, [center, zoom, map]);
  
  return null;
};

const Map = ({
  userLocation = null,
  restaurantLocations = [],
  deliveryAddress = null,
  orderLocation = null,
  onMapClick = null,
  zoom = 13,
  className = 'map-container'
}) => {
  const [mapCenter, setMapCenter] = useState([51.505, -0.09]); // Default center
  const [loading, setLoading] = useState(true);

  // Get user's geolocation
  useEffect(() => {
    if (!userLocation) {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            setMapCenter([latitude, longitude]);
            setLoading(false);
          },
          (error) => {
            console.log('Geolocation error:', error);
            setLoading(false);
            // Default to London if geolocation fails
            setMapCenter([51.505, -0.09]);
          }
        );
      } else {
        setLoading(false);
      }
    } else if (userLocation && userLocation.lat && userLocation.lng) {
      setMapCenter([userLocation.lat, userLocation.lng]);
      setLoading(false);
    }
  }, [userLocation]);

  if (loading) {
    return <div className={className}><p>Loading map...</p></div>;
  }

  return (
    <div className={className}>
      <MapContainer center={mapCenter} zoom={zoom} className="map-content">
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />

        {/* User Location */}
        {(userLocation || mapCenter) && (
          <Marker position={userLocation ? [userLocation.lat, userLocation.lng] : mapCenter} icon={userIcon}>
            <Popup>
              <div className="popup-content">
                <strong>Your Location</strong>
                <p>{userLocation?.name || 'Your current location'}</p>
              </div>
            </Popup>
          </Marker>
        )}

        {/* Restaurant Locations */}
        {restaurantLocations && restaurantLocations.length > 0 && (
          restaurantLocations.map((restaurant, index) => (
            <Marker
              key={`restaurant-${index}`}
              position={[restaurant.lat, restaurant.lng]}
              icon={restaurantIcon}
            >
              <Popup>
                <div className="popup-content">
                  <strong>{restaurant.name}</strong>
                  <p>{restaurant.address}</p>
                  {restaurant.rating && <p>Rating: {restaurant.rating} ⭐</p>}
                  {restaurant.deliveryTime && <p>Delivery Time: {restaurant.deliveryTime} mins</p>}
                </div>
              </Popup>
            </Marker>
          ))
        )}

        {/* Delivery Address */}
        {deliveryAddress && deliveryAddress.lat && deliveryAddress.lng && (
          <Marker position={[deliveryAddress.lat, deliveryAddress.lng]} icon={deliveryIcon}>
            <Popup>
              <div className="popup-content">
                <strong>Delivery Address</strong>
                <p>{deliveryAddress.address}</p>
              </div>
            </Popup>
          </Marker>
        )}

        {/* Order Location (for tracking) */}
        {orderLocation && orderLocation.lat && orderLocation.lng && (
          <Marker position={[orderLocation.lat, orderLocation.lng]} icon={deliveryIcon}>
            <Popup>
              <div className="popup-content">
                <strong>Order Location</strong>
                <p>{orderLocation.name || 'Current order location'}</p>
              </div>
            </Popup>
          </Marker>
        )}

        <MapUpdater center={mapCenter} zoom={zoom} />
      </MapContainer>
    </div>
  );
};

export default Map;
