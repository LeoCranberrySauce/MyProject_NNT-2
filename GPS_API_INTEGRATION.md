# GPS API Integration & Map Display Documentation

## Overview
This project now includes a complete GPS API integration with an interactive map display system for finding nearby restaurants and tracking deliveries.

## Features Implemented

### 1. **Backend GPS/Location Services**
   - **Location Model** (`locationModel.js`): Stores location data for restaurants, users, and deliveries
   - **Location Controller** (`locationController.js`): Handles all location-related operations
   - **Location Routes** (`locationRoute.js`): API endpoints for location services

### 2. **Frontend Map Components**
   - **Map Component** (`components/Map/Map.jsx`): Interactive map with multiple marker types
   - **MapDisplay Page** (`pages/MapDisplay/MapDisplay.jsx`): Full-featured map interface
   - **useGeolocation Hook** (`hooks/useGeolocation.js`): Custom hook for GPS access

### 3. **Enhanced Context**
   - **StoreContext**: Extended with GPS/location functionality
   - Methods for retrieving user location, nearby restaurants, and delivery tracking

## API Endpoints

### Location Endpoints

#### 1. Get All Restaurant Locations
```
GET /api/location/restaurants
```
**Response:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "...",
      "type": "restaurant",
      "name": "Restaurant Name",
      "address": "123 Main St",
      "latitude": 40.7128,
      "longitude": -74.0060,
      "rating": 4.5,
      "deliveryTime": 30
    }
  ]
}
```

#### 2. Get Nearby Restaurants (Geolocation-based)
```
POST /api/location/nearby
```
**Request Body:**
```json
{
  "latitude": 40.7128,
  "longitude": -74.0060,
  "radius": 5
}
```
**Response:** Array of restaurants within specified radius (in km)

#### 3. Save User Location
```
POST /api/location/save-location
Headers: { Authorization: token }
```
**Request Body:**
```json
{
  "name": "My Favorite Location",
  "address": "123 Main St",
  "latitude": 40.7128,
  "longitude": -74.0060
}
```

#### 4. Get Delivery Location
```
POST /api/location/delivery-location
```
**Request Body:**
```json
{
  "orderId": "64a5f3c2b1e4d9f8a2c3d4e5"
}
```

#### 5. Update Delivery Location (Live Tracking)
```
POST /api/location/update-delivery
```
**Request Body:**
```json
{
  "orderId": "64a5f3c2b1e4d9f8a2c3d4e5",
  "latitude": 40.7128,
  "longitude": -74.0060,
  "name": "Delivery in Progress"
}
```

## Frontend Usage

### Using the Map Component

```jsx
import Map from './components/Map/Map';

<Map
  userLocation={{ lat: 40.7128, lng: -74.0060 }}
  restaurantLocations={[
    {
      lat: 40.7138,
      lng: -74.0070,
      name: "Restaurant Name",
      address: "Address",
      rating: 4.5,
      deliveryTime: 30
    }
  ]}
  deliveryAddress={{ lat: 40.7148, lng: -74.0080, address: "Delivery Address" }}
  zoom={13}
/>
```

### Using the MapDisplay Page

Navigate to `/map` in the application to access the full-featured map interface.

**Features:**
- Find nearby restaurants based on current GPS location
- View restaurant details on the map
- Save delivery addresses with GPS coordinates
- Track active deliveries in real-time
- Switch between restaurant discovery and delivery tracking modes

### Using StoreContext

```jsx
import { useContext } from 'react';
import { StoreContext } from './context/StoreContext';

const MyComponent = () => {
  const {
    userLocation,
    getUserLocation,
    restaurantLocations,
    fetchNearbyRestaurants,
    deliveryAddress,
    saveDeliveryAddress,
  } = useContext(StoreContext);

  const handleGetLocation = async () => {
    const location = await getUserLocation();
    console.log('User location:', location);
  };

  const handleFindRestaurants = async () => {
    await fetchNearbyRestaurants(
      userLocation.lat,
      userLocation.lng,
      5 // radius in km
    );
  };

  return (
    <>
      <button onClick={handleGetLocation}>Get My Location</button>
      <button onClick={handleFindRestaurants}>Find Restaurants</button>
    </>
  );
};
```

### Using useGeolocation Hook

```jsx
import { useGeolocation } from './hooks/useGeolocation';

const LocationComponent = () => {
  const { location, error, loading, getDistance } = useGeolocation();

  if (loading) return <div>Loading location...</div>;
  if (error) return <div>Error: {error}</div>;

  const distanceToRestaurant = getDistance(
    location.lat,
    location.lng,
    40.7138,
    -74.0070
  );

  return (
    <div>
      <p>Your location: {location.lat}, {location.lng}</p>
      <p>Distance to restaurant: {distanceToRestaurant.toFixed(2)} km</p>
    </div>
  );
};
```

## Database Schema

### Location Model

```javascript
{
  type: String,              // "restaurant", "user", or "delivery"
  name: String,              // Location name
  address: String,           // Street address
  latitude: Number,          // GPS latitude
  longitude: Number,         // GPS longitude
  description: String,       // Optional description
  rating: Number,           // Optional rating (1-5)
  deliveryTime: Number,     // Optional delivery time in minutes
  restaurantId: ObjectId,   // Reference to restaurant
  userId: ObjectId,         // Reference to user
  orderId: ObjectId,        // Reference to order
  isActive: Boolean,        // Location availability status
  timestamps: true          // createdAt and updatedAt
}
```

## Map Features

### Map Component Capabilities
- **OpenStreetMap Integration**: Uses Leaflet.js with OpenStreetMap tiles
- **Custom Markers**: Different colored markers for users, restaurants, and deliveries
- **Interactive Popups**: Click markers to see detailed information
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Auto-centering**: Automatically centers on user location

### MapDisplay Page Features
- **Dual Mode Interface**: Switch between Restaurant Discovery and Delivery Tracking
- **Real-time Location**: Get current GPS coordinates
- **Restaurant Search**: Find nearby restaurants with distance calculation
- **Address Management**: Save delivery addresses with exact GPS coordinates
- **Order Tracking**: Track active deliveries in real-time
- **Responsive Layout**: Two-column layout on desktop, single column on mobile

## Distance Calculation

The system uses the Haversine formula to calculate distances between locations:

```javascript
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}
```

## Browser Permissions

The application requires the following permissions:
- **Geolocation**: To access user's GPS coordinates

### Requesting Permission

The application will automatically request geolocation permission when:
1. User clicks "Get My Location" button
2. User accesses the map display page
3. User performs location-based search

## Styling

### Map Component Styling
- Modern card-based design with shadows
- Smooth transitions and hover effects
- Color-coded markers (blue for user, red for restaurant, green for delivery)
- Responsive popups with formatted information

### MapDisplay Page Styling
- Gradient backgrounds
- Two-column layout with sidebar controls
- Interactive restaurant cards with hover effects
- Touch-friendly buttons for mobile devices
- Color scheme: Purple/Blue gradient theme

## Installation & Setup

### Frontend Dependencies
```bash
npm install leaflet react-leaflet
```

### Backend Setup
1. Location model is automatically registered with MongoDB
2. Location routes are integrated into the main server
3. No additional packages required (uses existing mongoose and express)

### Configuration
- Backend URL: `http://localhost:4000` (set in StoreContext)
- Map center default: London (51.505, -0.09)
- Default search radius: 5 km

## Browser Compatibility

- **Chrome**: ✅ Full support
- **Firefox**: ✅ Full support
- **Safari**: ✅ Full support
- **Edge**: ✅ Full support
- **Internet Explorer**: ❌ Not supported

## Security Considerations

1. **Authentication**: Saving locations requires user authentication (token)
2. **Data Privacy**: GPS coordinates are stored with user consent
3. **CORS**: Backend configured with CORS for cross-origin requests
4. **Rate Limiting**: Consider adding rate limiting for location endpoints in production

## Future Enhancements

1. **Real-time Updates**: WebSocket integration for live delivery tracking
2. **Advanced Filtering**: Filter restaurants by cuisine, rating, delivery time
3. **Route Optimization**: Calculate optimal delivery routes
4. **Geofencing**: Notify users when delivery is nearby
5. **Map Offline Mode**: Cache maps for offline access
6. **Multi-language Support**: Translate location names and addresses
7. **Advanced Search**: Search by restaurant name, cuisine type, etc.

## Troubleshooting

### Map Not Displaying
- Check browser console for errors
- Ensure OpenStreetMap tiles are loading
- Verify CSS is properly imported

### Location Not Found
- Check if geolocation is enabled in browser settings
- Verify GPS signal is available
- Check browser permissions for the site

### Nearby Restaurants Empty
- Ensure restaurants exist in database with valid GPS coordinates
- Check location radius is appropriate
- Verify restaurant locations are marked as `isActive: true`

### Styling Issues
- Clear browser cache and reload
- Check if CSS files are properly imported
- Verify Leaflet CSS is loaded for map styling

## Example Implementation

### Adding Restaurant Locations to Database

```javascript
// In backend, create sample restaurant locations
const sampleLocations = [
  {
    type: "restaurant",
    name: "Pizza Palace",
    address: "123 Main St, New York",
    latitude: 40.7138,
    longitude: -74.0070,
    rating: 4.5,
    deliveryTime: 30,
  },
  {
    type: "restaurant",
    name: "Burger Haven",
    address: "456 Oak Ave, New York",
    latitude: 40.7148,
    longitude: -74.0080,
    rating: 4.2,
    deliveryTime: 25,
  },
];

await Location.insertMany(sampleLocations);
```

### Using in PlaceOrder Page

```jsx
import { useContext } from 'react';
import { StoreContext } from '../context/StoreContext';
import Map from '../components/Map/Map';

export const PlaceOrder = () => {
  const { 
    userLocation, 
    restaurantLocations,
    deliveryAddress,
    saveDeliveryAddress 
  } = useContext(StoreContext);

  const handleSaveDeliveryAddress = (address, lat, lng) => {
    saveDeliveryAddress(address, lat, lng);
  };

  return (
    <div>
      <Map
        userLocation={userLocation}
        restaurantLocations={restaurantLocations}
        deliveryAddress={deliveryAddress}
        zoom={13}
      />
      {/* Delivery form with map integration */}
    </div>
  );
};
```

## Support

For issues or feature requests, please refer to the project documentation or contact the development team.
