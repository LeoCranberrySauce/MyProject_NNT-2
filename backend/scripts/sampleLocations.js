// Sample data insertion script for Location Model
// Run this in your MongoDB database or through a backend endpoint

const sampleRestaurantLocations = [
  {
    type: "restaurant",
    name: "Pizza Palace",
    address: "123 Main Street, New York, NY 10001",
    latitude: 40.7138,
    longitude: -74.0070,
    description: "Authentic Italian pizza restaurant",
    rating: 4.7,
    deliveryTime: 25,
    isActive: true,
  },
  {
    type: "restaurant",
    name: "Burger Haven",
    address: "456 Park Avenue, New York, NY 10022",
    latitude: 40.7148,
    longitude: -74.0080,
    description: "Premium burger joint with homemade patties",
    rating: 4.5,
    deliveryTime: 20,
    isActive: true,
  },
  {
    type: "restaurant",
    name: "Sushi Supreme",
    address: "789 Madison Avenue, New York, NY 10016",
    latitude: 40.7160,
    longitude: -74.0060,
    description: "Fresh sushi and Japanese cuisine",
    rating: 4.8,
    deliveryTime: 30,
    isActive: true,
  },
  {
    type: "restaurant",
    name: "Dragon Wok",
    address: "321 5th Avenue, New York, NY 10016",
    latitude: 40.7128,
    longitude: -74.0050,
    description: "Asian fusion and Chinese specialties",
    rating: 4.3,
    deliveryTime: 28,
    isActive: true,
  },
  {
    type: "restaurant",
    name: "Taco Fiesta",
    address: "654 Broadway, New York, NY 10012",
    latitude: 40.7130,
    longitude: -74.0090,
    description: "Authentic Mexican street tacos",
    rating: 4.6,
    deliveryTime: 22,
    isActive: true,
  },
  {
    type: "restaurant",
    name: "Pasta Paradise",
    address: "987 Columbus Avenue, New York, NY 10025",
    latitude: 40.7150,
    longitude: -74.0075,
    description: "Classic Italian pasta dishes",
    rating: 4.4,
    deliveryTime: 26,
    isActive: true,
  },
  {
    type: "restaurant",
    name: "BBQ Pit Stop",
    address: "159 Houston Street, New York, NY 10012",
    latitude: 40.7115,
    longitude: -74.0070,
    description: "Slow-smoked BBQ and ribs",
    rating: 4.7,
    deliveryTime: 35,
    isActive: true,
  },
  {
    type: "restaurant",
    name: "Vegan Garden",
    address: "753 Spring Street, New York, NY 10012",
    latitude: 40.7125,
    longitude: -74.0085,
    description: "Plant-based and vegan cuisine",
    rating: 4.5,
    deliveryTime: 24,
    isActive: true,
  },
  {
    type: "restaurant",
    name: "Chicken Express",
    address: "852 Lexington Avenue, New York, NY 10065",
    latitude: 40.7145,
    longitude: -74.0055,
    description: "Fried and grilled chicken specialties",
    rating: 4.2,
    deliveryTime: 18,
    isActive: true,
  },
  {
    type: "restaurant",
    name: "Greek Taverna",
    address: "456 University Place, New York, NY 10003",
    latitude: 40.7135,
    longitude: -74.0065,
    description: "Traditional Greek and Mediterranean dishes",
    rating: 4.6,
    deliveryTime: 29,
    isActive: true,
  },
];

// MongoDB Insert Command
// db.locations.insertMany([...sampleRestaurantLocations])

// For backend API endpoint, create a route like:
/*
POST /api/location/seed (optional, for development only)
Body: { locations: sampleRestaurantLocations }
*/

// Or add to your database initialization script
export default sampleRestaurantLocations;
