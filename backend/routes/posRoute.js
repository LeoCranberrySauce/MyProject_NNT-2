import express from "express";
import { placePosOrder, getPosOrders, getActiveDineInOrders, voidOrder, completeOrder, getPosSalesSummary, getReceipt } from "../controllers/posController.js";

const posRouter = express.Router();

posRouter.post("/place", placePosOrder);
posRouter.get("/orders", getPosOrders);
posRouter.get("/active-dine-in", getActiveDineInOrders);
posRouter.post("/void", voidOrder);
posRouter.post("/complete", completeOrder);
posRouter.get("/sales-summary", getPosSalesSummary);
posRouter.get("/receipt/:orderId", getReceipt);

export default posRouter;