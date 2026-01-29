import Location from "../models/locationModel.js";

// Get all restaurant locations
export const getRestaurantLocations = async (req, res) => {
  try {
    const locations = await Location.find({
      type: "restaurant",
      isActive: true,
    }).populate("restaurantId", "name image price");

    res.json({ success: true, data: locations });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error fetching restaurant locations" });
  }
};

// Get nearby restaurants based on user location
export const getNearbyRestaurants = async (req, res) => {
  try {
    const { latitude, longitude, radius = 5 } = req.body; // radius in km

    if (!latitude || !longitude) {
      return res.json({
        success: false,
        message: "Latitude and longitude are required",
      });
    }

    // Simple distance calculation using Haversine formula
    const locations = await Location.find({
      type: "restaurant",
      isActive: true,
    }).populate("restaurantId", "name image price");

    // Filter by distance
    const nearbyRestaurants = locations.filter((location) => {
      const distance = calculateDistance(
        latitude,
        longitude,
        location.latitude,
        location.longitude
      );
      return distance <= radius;
    });

    res.json({ success: true, data: nearbyRestaurants });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error fetching nearby restaurants" });
  }
};

// Save user location
export const saveUserLocation = async (req, res) => {
  try {
    const { userId, name, address, latitude, longitude } = req.body;

    if (!userId || !latitude || !longitude) {
      return res.json({
        success: false,
        message: "Missing required fields",
      });
    }

    const location = new Location({
      type: "user",
      name: name || "My Location",
      address,
      latitude,
      longitude,
      userId,
    });

    await location.save();
    res.json({ success: true, data: location });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error saving user location" });
  }
};

// Get delivery tracking location
export const getDeliveryLocation = async (req, res) => {
  try {
    const { orderId } = req.body;

    const location = await Location.findOne({
      orderId,
      type: "delivery",
    });

    if (!location) {
      return res.json({ success: false, message: "Location not found" });
    }

    res.json({ success: true, data: location });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error fetching delivery location" });
  }
};

// Update delivery location (for order tracking)
export const updateDeliveryLocation = async (req, res) => {
  try {
    const { orderId, latitude, longitude, name } = req.body;

    if (!orderId || !latitude || !longitude) {
      return res.json({
        success: false,
        message: "Missing required fields",
      });
    }

    let location = await Location.findOne({
      orderId,
      type: "delivery",
    });

    if (!location) {
      location = new Location({
        type: "delivery",
        name: name || "Delivery in progress",
        orderId,
        latitude,
        longitude,
      });
    } else {
      location.latitude = latitude;
      location.longitude = longitude;
      if (name) location.name = name;
    }

    await location.save();
    res.json({ success: true, data: location });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error updating delivery location" });
  }
};

// Helper function to calculate distance between two coordinates
const calculateDistance = (lat1, lon1, lat2, lon2) => {
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
};
