# GPS API Integration - Quick Setup Guide

## 📋 What's New

Your application now has a complete GPS/Location API integration with an interactive map display system!

### ✨ New Features:
- 🗺️ Interactive map for finding restaurants
- 📍 Real-time GPS location tracking
- 🚚 Live delivery order tracking
- 📌 Save delivery addresses with GPS coordinates
- 📊 Distance calculation between locations

## 🚀 Quick Start

### 1. Backend Setup
The backend is already configured! No additional setup needed.

**New Files:**
- `backend/models/locationModel.js` - Location data model
- `backend/controllers/locationController.js` - Location operations logic
- `backend/routes/locationRoute.js` - Location API endpoints

**Updated Files:**
- `backend/server.js` - Added location routes

### 2. Frontend Setup

#### Install Map Dependencies (if not already done)
```bash
cd frontend
npm install leaflet react-leaflet
```

**New Files:**
- `frontend/src/components/Map/Map.jsx` - Reusable map component
- `frontend/src/components/Map/Map.css` - Map styling
- `frontend/src/pages/MapDisplay/MapDisplay.jsx` - Full map interface page
- `frontend/src/pages/MapDisplay/MapDisplay.css` - Page styling
- `frontend/src/hooks/useGeolocation.js` - Custom GPS hook

**Updated Files:**
- `frontend/src/context/StoreContext.jsx` - Added GPS functionality
- `frontend/src/App.jsx` - Added `/map` route
- `frontend/src/components/Navbar/Navbar.jsx` - Added Map link

## 🎯 How to Use

### Access the Map Interface
1. Start your frontend: `npm run dev`
2. Click on the **"📍 Map"** link in the navbar
3. Grant location permission when prompted
4. Start exploring restaurants!

### Features in Detail

#### 🏪 Restaurant Discovery
1. Click "🔍 Find Nearby Restaurants"
2. View all nearby restaurants on the map
3. Click on restaurant markers for details (rating, delivery time)
4. Select restaurants from the sidebar list

#### 📍 Save Delivery Address
1. Click on the map to select a location or enter address manually
2. Enter delivery address in the input field
3. Click "💾 Save Address"
4. Address is saved with exact GPS coordinates

#### 🚚 Track Deliveries
1. Switch to "Delivery Tracking" tab
2. Enter your order ID
3. Click "🚚 Start Tracking"
4. View real-time delivery location on map

## 📡 API Endpoints

### Get Nearby Restaurants
```javascript
POST http://localhost:4000/api/location/nearby
Body: { latitude, longitude, radius }
```

### Get All Restaurants
```javascript
GET http://localhost:4000/api/location/restaurants
```

### Save Delivery Address
```javascript
POST http://localhost:4000/api/location/save-location
Headers: { Authorization: token }
Body: { name, address, latitude, longitude }
```

### Track Delivery
```javascript
POST http://localhost:4000/api/location/update-delivery
Body: { orderId, latitude, longitude, name }
```

## 💻 Code Examples

### Using Map Component in Your Pages
```jsx
import Map from '../../components/Map/Map';

<Map
  userLocation={{ lat: 40.7128, lng: -74.0060 }}
  restaurantLocations={restaurantList}
  deliveryAddress={address}
  zoom={13}
/>
```

### Accessing GPS Functions from Context
```jsx
import { useContext } from 'react';
import { StoreContext } from '../context/StoreContext';

const MyComponent = () => {
  const {
    userLocation,
    getUserLocation,
    fetchNearbyRestaurants,
    saveDeliveryAddress
  } = useContext(StoreContext);

  // Use these functions...
};
```

### Using Geolocation Hook
```jsx
import { useGeolocation } from '../hooks/useGeolocation';

const LocationComponent = () => {
  const { location, error, loading, getDistance } = useGeolocation();
  // Access location data...
};
```

## 🗺️ Map Details

### Map Markers
- 🔵 **Blue Marker**: Your current location
- 🔴 **Red Marker**: Restaurants
- 🟢 **Green Marker**: Delivery address/location

### Map Features
- **Zoom Controls**: Built-in zoom in/out
- **Pan**: Click and drag to move around
- **Click Popups**: Click markers for detailed info
- **Attribution**: OpenStreetMap credits shown

## 🔧 Integration Points

### 1. PlaceOrder Page
Add map to show delivery address selection:
```jsx
import Map from '../components/Map/Map';
<Map userLocation={userLocation} zoom={15} />
```

### 2. MyOrders Page
Show live delivery tracking:
```jsx
const { getDeliveryLocation } = useContext(StoreContext);
// Fetch and display delivery location
```

### 3. Home Page
Add restaurant discovery widget:
```jsx
import MapDisplay from '../pages/MapDisplay/MapDisplay';
// Or just use Map component
```

## 📱 Mobile Responsive
- The map automatically adjusts for mobile screens
- Touch-friendly buttons and controls
- One-column layout on mobile devices
- Full two-column layout on desktop

## 🔒 Permissions Required
- **Geolocation**: Browser will ask for permission when needed
- No other special permissions required
- Works with HTTP and HTTPS

## 🐛 Troubleshooting

### Map not showing?
1. Check browser console for errors
2. Ensure `leaflet` and `react-leaflet` are installed
3. Clear cache: `npm run build` and reload

### Location not found?
1. Check if browser geolocation is enabled
2. Check browser privacy settings
3. Ensure GPS/location services are on device

### Restaurants not appearing?
1. Add restaurant locations to database
2. Ensure they have valid lat/lng coordinates
3. Check if restaurants are within search radius

### Styling looks wrong?
1. Clear browser cache (Ctrl+Shift+Delete)
2. Restart dev server
3. Check CSS file imports

## 📦 Dependencies Added
```json
{
  "leaflet": "^1.9.x",
  "react-leaflet": "^4.x.x"
}
```

## 🎓 Learning Resources

- Leaflet Documentation: https://leafletjs.com/
- React-Leaflet: https://react-leaflet.js.org/
- Geolocation API: https://developer.mozilla.org/en-US/docs/Web/API/Geolocation_API
- OpenStreetMap: https://www.openstreetmap.org/

## 📞 Support

If you encounter issues:
1. Check the GPS_API_INTEGRATION.md for detailed documentation
2. Review browser console for error messages
3. Ensure all dependencies are installed
4. Check that backend server is running on port 4000

## 🎉 Next Steps

1. **Add Sample Data**: Insert restaurant locations in database
2. **Customize Styling**: Modify CSS files to match your theme
3. **Add Filters**: Filter restaurants by cuisine, price, etc.
4. **Enable Notifications**: Notify users of delivery updates
5. **Integrate with Orders**: Connect map to existing order system

---

Happy mapping! 🗺️✨
