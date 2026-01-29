# GPS API Integration - Architecture & Data Flow

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         USER'S BROWSER                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │              FRONTEND APPLICATIONS                       │  │
│  ├──────────────────────────────────────────────────────────┤  │
│  │                                                            │  │
│  │  ┌─────────────────────┐  ┌──────────────────────────┐  │  │
│  │  │   MapDisplay Page   │  │   Other Pages (Home,     │  │  │
│  │  │   (/map route)      │  │   Cart, Orders, etc.)    │  │  │
│  │  └──────────┬──────────┘  └──────────────────────────┘  │  │
│  │             │                                             │  │
│  │  ┌──────────▼──────────┐                                 │  │
│  │  │   Map Component     │                                 │  │
│  │  │  (Leaflet/OSM)      │                                 │  │
│  │  └──────────┬──────────┘                                 │  │
│  │             │                                             │  │
│  │  ┌──────────▼──────────────────────────────────────┐   │  │
│  │  │        StoreContext (GPS Methods)                │   │  │
│  │  │  - getUserLocation()                             │   │  │
│  │  │  - fetchNearbyRestaurants()                      │   │  │
│  │  │  - saveDeliveryAddress()                         │   │  │
│  │  │  - getDeliveryLocation()                         │   │  │
│  │  │  - updateDeliveryLocation()                      │   │  │
│  │  └──────────┬───────────────────────────────────────┘   │  │
│  │             │                                             │  │
│  └─────────────┼─────────────────────────────────────────────┘  │
│                │                                                  │
│  ┌─────────────▼─────────────────────────────────────────┐     │
│  │      Browser APIs                                     │     │
│  │  ┌──────────────────┐  ┌────────────────────────┐   │     │
│  │  │  Geolocation API │  │  Local Storage (Token) │   │     │
│  │  │  (GPS Request)   │  └────────────────────────┘   │     │
│  │  └──────────────────┘                                │     │
│  └─────────────┬──────────────────────────────────────────┘     │
│                │                                                  │
└────────────────┼──────────────────────────────────────────────────┘
                 │
                 │ HTTP Requests
                 │ (REST API Calls)
                 ▼
┌────────────────────────────────────────────────────────────────┐
│                     BACKEND SERVER                              │
│                   (Node.js + Express)                           │
├────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐ │
│  │              Location Routes (/api/location)             │ │
│  │  ┌──────────┐ ┌───────────┐ ┌────────────┐             │ │
│  │  │ GET      │ │ POST      │ │ POST       │             │ │
│  │  │/restaurants│/nearby     │/save-location│             │ │
│  │  └──┬───────┘ └──┬────────┘ └─────┬──────┘             │ │
│  │  ┌─▼─┬─────────┬─▼──────────┬────▼──────────────────┐ │ │
│  │  │POST │ POST   │            │                      │ │ │
│  │  │/delivery- │/update-delivery│                      │ │ │
│  │  │location   │                │                      │ │ │
│  │  └──────────────────────────────────────────────────┘ │ │
│  └─────────────────────┬────────────────────────────────┘ │
│                        │                                   │
│  ┌─────────────────────▼──────────────────────────────┐   │
│  │        Location Controller                        │   │
│  │  - getRestaurantLocations()                       │   │
│  │  - getNearbyRestaurants()                         │   │
│  │  - saveUserLocation()                             │   │
│  │  - getDeliveryLocation()                          │   │
│  │  - updateDeliveryLocation()                       │   │
│  │  - calculateDistance() [Haversine Formula]        │   │
│  └─────────────────────┬──────────────────────────────┘   │
│                        │                                   │
│  ┌─────────────────────▼──────────────────────────────┐   │
│  │        Middleware                                  │   │
│  │  - Auth Middleware (token verification)           │   │
│  │  - Error Handling                                  │   │
│  │  - Request Validation                              │   │
│  └─────────────────────┬──────────────────────────────┘   │
│                        │                                   │
└────────────────────────┼──────────────────────────────────┘
                         │
                         │ Mongoose ODM
                         ▼
┌────────────────────────────────────────────────────────────────┐
│                     MONGODB DATABASE                            │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐ │
│  │           Locations Collection                          │ │
│  │  ┌────────────────────────────────────────────────────┐ │ │
│  │  │ Documents:                                         │ │ │
│  │  │  - Restaurants (type: "restaurant")                │ │ │
│  │  │    { name, address, latitude, longitude,          │ │ │
│  │  │      rating, deliveryTime, isActive }             │ │ │
│  │  │                                                     │ │ │
│  │  │  - Users (type: "user")                            │ │ │
│  │  │    { name, address, latitude, longitude,          │ │ │
│  │  │      userId }                                      │ │ │
│  │  │                                                     │ │ │
│  │  │  - Deliveries (type: "delivery")                   │ │ │
│  │  │    { name, latitude, longitude, orderId,          │ │ │
│  │  │      timestamps }                                  │ │ │
│  │  │                                                     │ │ │
│  │  └────────────────────────────────────────────────────┘ │ │
│  │                                                            │ │
│  │  Other Collections:                                       │ │
│  │  - Users, Orders, Food, Categories, etc.                │ │
│  │                                                            │ │
│  └──────────────────────────────────────────────────────────┘ │
│                                                                  │
└────────────────────────────────────────────────────────────────┘
```

---

## 📊 Data Flow Diagrams

### 1️⃣ Get User Location Flow

```
User Clicks "Get My Location"
         ▼
Browser Requests Geolocation Permission
         ▼
User Grants Permission
         ▼
Browser Returns GPS Coordinates
         ▼
useGeolocation Hook Captures Coordinates
         ▼
StoreContext Updates userLocation State
         ▼
MapDisplay Component Updates mapCenter
         ▼
Map Component Centers on User Location
         ▼
Blue Marker Appears at User Location
         ▼
Location Details Display in Sidebar
```

### 2️⃣ Find Nearby Restaurants Flow

```
User Clicks "Find Nearby Restaurants"
         ▼
MapDisplay Calls fetchNearbyRestaurants()
         ▼
Sends POST /api/location/nearby
         ├─ latitude: user's current latitude
         ├─ longitude: user's current longitude
         └─ radius: 5km (default)
         ▼
Backend Receives Request
         ▼
Location Controller Processes Request
         ▼
Fetches All Active Restaurants from Database
         ▼
Calculates Distance for Each Restaurant
(Using Haversine Formula)
         ▼
Filters Restaurants Within Radius
         ▼
Returns Filtered Restaurants to Frontend
         ▼
StoreContext Updates restaurantLocations
         ▼
Map Component Displays Red Markers
         ▼
Restaurant List Appears in Sidebar
         ▼
User Can Click Markers or List Items
```

### 3️⃣ Save Delivery Address Flow

```
User Enters Address Text
         ▼
User Clicks "Save Address" Button
         ▼
MapDisplay Calls saveDeliveryAddress()
         ├─ address: entered text
         ├─ latitude: current map center lat
         └─ longitude: current map center lng
         ▼
Sends POST /api/location/save-location
(Requires Auth Token in Headers)
         ▼
Backend Validates Authentication
         ▼
Location Controller Saves Location
         ▼
Creates New Location Document in Database
         └─ type: "user"
         └─ address: provided address
         └─ coordinates: exact GPS coordinates
         └─ userId: authenticated user ID
         ▼
Returns Saved Location to Frontend
         ▼
StoreContext Updates deliveryAddress
         ▼
Success Message Displays to User
         ▼
Green Marker Appears on Map
         ▼
Address Details Show in Sidebar
```

### 4️⃣ Track Delivery Flow

```
User Enters Order ID
         ▼
User Clicks "Start Tracking" Button
         ▼
MapDisplay Calls updateDeliveryLocation()
         ├─ orderId: entered order ID
         ├─ latitude: current GPS latitude
         └─ longitude: current GPS longitude
         ▼
Sends POST /api/location/update-delivery
         ▼
Backend Receives Update Request
         ▼
Location Controller Processes
         ▼
Finds or Creates Delivery Location Document
         └─ type: "delivery"
         └─ orderId: order being tracked
         └─ coordinates: current delivery GPS
         ▼
Updates Location in Database
         ▼
Returns Current Location to Frontend
         ▼
StoreContext Updates orderDeliveryLocation
         ▼
Map Centers on Delivery Location
         ▼
Green Marker Shows Current Delivery Position
         ▼
User Can See Real-Time Delivery Status
         
(Repeat: Server updates delivery coordinates)
         ▼
Map Updates to Show Current Position
```

### 5️⃣ Distance Calculation Flow

```
Have Two Coordinates:
  Point 1: (lat1, lng1) - User or Restaurant A
  Point 2: (lat2, lng2) - Restaurant or User B
         ▼
Apply Haversine Formula:
  a = sin²(Δlat/2) + cos(lat1) × cos(lat2) × sin²(Δlng/2)
  c = 2 × atan2(√a, √(1−a))
  d = R × c  (R = Earth radius = 6371 km)
         ▼
Result: Distance in Kilometers
         ▼
Used For:
  - Filtering nearby restaurants
  - Sorting by distance
  - Delivery distance estimation
```

---

## 🔄 State Management Flow

```
┌─────────────────────────────────────────┐
│      StoreContext Global State          │
├─────────────────────────────────────────┤
│                                         │
│ Location States:                       │
│  ├─ userLocation                       │
│  ├─ restaurantLocations               │
│  ├─ selectedRestaurant                │
│  ├─ deliveryAddress                   │
│  ├─ orderDeliveryLocation             │
│  └─ locationPermission                │
│                                         │
│ Location Methods:                       │
│  ├─ getUserLocation()                  │
│  ├─ fetchNearbyRestaurants()          │
│  ├─ fetchRestaurantLocations()        │
│  ├─ saveDeliveryAddress()             │
│  ├─ getDeliveryLocation()             │
│  └─ updateDeliveryLocation()          │
│                                         │
└────────────────────────────────────────┘
         ▲           │
         │           │
   ┌─────┴───────────▼──────────┐
   │   Component Consumption    │
   │    (useContext hook)       │
   ├───────────────────────────┤
   │  - MapDisplay             │
   │  - Map                    │
   │  - Any other component    │
   └───────────────────────────┘
```

---

## 🌐 API Endpoint Map

```
Location API Router
│
├─ GET  /restaurants
│       Returns: All restaurant locations
│       Auth: None
│       Response: { success, data: [...] }
│
├─ POST /nearby
│       Params: { latitude, longitude, radius }
│       Auth: None
│       Response: { success, data: [...] }
│
├─ POST /save-location
│       Params: { name, address, latitude, longitude }
│       Auth: Required (token in headers)
│       Response: { success, data: savedLocation }
│
├─ POST /delivery-location
│       Params: { orderId }
│       Auth: None
│       Response: { success, data: location }
│
└─ POST /update-delivery
        Params: { orderId, latitude, longitude, name }
        Auth: None
        Response: { success, data: updatedLocation }
```

---

## 📦 Component Dependency Graph

```
App.jsx
  ├─ Navbar.jsx
  │  └─ Link to /map
  │
  ├─ Routes
  │  ├─ / → Home.jsx
  │  ├─ /cart → Cart.jsx
  │  ├─ /order → PlaceOrder.jsx
  │  ├─ /my-orders → MyOrders.jsx
  │  └─ /map → MapDisplay.jsx ◄────── NEW
  │     ├─ Map.jsx (Component)
  │     │  └─ Leaflet MapContainer
  │     │     ├─ TileLayer (OSM)
  │     │     ├─ Markers
  │     │     └─ Popups
  │     │
  │     └─ Sidebar Controls
  │        ├─ useContext(StoreContext)
  │        ├─ getUserLocation()
  │        ├─ fetchNearbyRestaurants()
  │        ├─ saveDeliveryAddress()
  │        └─ Restaurant List
  │
  └─ StoreContextProvider
     └─ StoreContext.jsx
        ├─ useGeolocation Hook
        ├─ API Calls (axios)
        │  ├─ GET /api/location/restaurants
        │  ├─ POST /api/location/nearby
        │  ├─ POST /api/location/save-location
        │  ├─ POST /api/location/delivery-location
        │  └─ POST /api/location/update-delivery
        │
        └─ State & Methods
           ├─ userLocation
           ├─ restaurantLocations
           ├─ deliveryAddress
           ├─ orderDeliveryLocation
           └─ GPS Methods
```

---

## 📱 Responsive Layout Breakpoints

```
Desktop (1200px+)
┌───────────────────────────────────────────────┐
│  Navbar                                       │
├──────────────────────┬───────────────────────┤
│                      │                       │
│   Map Component      │ Sidebar Controls      │
│   (60% width)        │ (40% width)           │
│                      │                       │
│   - Markers          │ - Find Restaurants   │
│   - Popups           │ - Restaurant List    │
│   - Controls         │ - Save Address       │
│                      │ - Location Info      │
└──────────────────────┴───────────────────────┘
│ Footer                                        │
└───────────────────────────────────────────────┘

Tablet (768px - 1199px)
┌──────────────────────────────┐
│   Navbar                     │
├──────────────────────────────┤
│   Map Component              │
│   (Full Width)               │
├──────────────────────────────┤
│   Sidebar Controls           │
│   (Scrollable)               │
├──────────────────────────────┤
│   Footer                     │
└──────────────────────────────┘

Mobile (< 480px)
┌──────────────────┐
│  Navbar          │
├──────────────────┤
│  Map Component   │
│  (Full Width)    │
│  (Scrollable)    │
│                  │
├──────────────────┤
│  Sidebar         │
│  (Scrollable)    │
├──────────────────┤
│  Footer          │
└──────────────────┘
```

---

## 🔐 Authentication Flow

```
User Wants to Save Location
         ▼
saveDeliveryAddress() Called
         ▼
Get token from localStorage
         ▼
Prepare Request
  Headers: { Authorization: token }
         ▼
POST /api/location/save-location
         ▼
Backend Auth Middleware
         ├─ Check if token exists
         ├─ Verify token signature
         ├─ Decode token
         └─ Extract userId
         ▼
Location Controller
         ├─ Save location with userId
         └─ Return saved location
         ▼
Frontend Receives Response
         ▼
StoreContext Updates
         ▼
UI Shows Success
```

---

## 🚀 Real-time Update Architecture (Future Enhancement)

```
Frontend                    Backend                  Database
   │                           │                          │
   ├─ User Opens Order ────────►│                          │
   │  Tracking                  ├─ WebSocket Connection  │
   │                            │  (socket.io)            │
   │                            │                          │
   │                            ├─ Query Current Location─►│
   │                            │                          │
   │◄───────────────────────────┤◄─────────────────────────┤
   │  Location Update           │                          │
   │  (every 5-10 secs)         │                          │
   │                            │                          │
   ├─ Re-center Map ────────────►│                          │
   │  Update Marker             │                          │
   │                            │                          │
   │                            ├─ Broadcast to all───────►│
   │                            │  tracking this order     │
   │                            │                          │
   │◄──────────────────────────◄┼──────────────────────────┤
   │  Real-time Delivery        │                          │
   │  Location                  │                          │
   │                            │                          │
   └────────────────────────────┴──────────────────────────┘
```

---

## 📊 Distance Calculation Example

```
User Location: (40.7128°N, 74.0060°W) - Times Square, NYC
Restaurant: (40.7180°N, 73.9950°W) - Midtown East, NYC

Haversine Formula Applied:
│
├─ Δlat = 40.7180 - 40.7128 = 0.0052°
├─ Δlng = 73.9950 - 74.0060 = -0.0110°
│
├─ a = sin²(0.0052°/2) + cos(40.7128°) × cos(40.7180°) × sin²(-0.0110°/2)
├─ a ≈ 0.0000066
│
├─ c = 2 × atan2(√0.0000066, √0.9999934)
├─ c ≈ 0.00803 radians
│
├─ d = 6371 km × 0.00803
└─ d ≈ 0.95 km (Less than 1 km away!)

Result: Restaurant is ~0.95 kilometers from user
```

---

This architecture provides a scalable, maintainable foundation for GPS-based features in your food delivery app! 🗺️✨
