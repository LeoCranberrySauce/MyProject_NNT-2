import express from "express";
import {
  getRestaurantLocations,
  getNearbyRestaurants,
  saveUserLocation,
  getDeliveryLocation,
  updateDeliveryLocation,
} from "../controllers/locationController.js";
import authMiddleware from "../middleware/auth.js";

const locationRouter = express.Router();

locationRouter.get("/restaurants", getRestaurantLocations);
locationRouter.post("/nearby", getNearbyRestaurants);
locationRouter.post("/save-location", authMiddleware, saveUserLocation);
locationRouter.post("/delivery-location", getDeliveryLocation);
locationRouter.post("/update-delivery", updateDeliveryLocation);

export default locationRouter;
