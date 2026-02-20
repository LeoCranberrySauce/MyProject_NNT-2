import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import Stripe from "stripe"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Placing an order
const placeOrder = async (req,res) => {

    const frontend_url = "http://localhost:5173";

    try {
        const newOrder = new orderModel({
            userId:req.userId,
            items:req.body.items,
            amount:req.body.amount,
            address:req.body.address
        })
        await newOrder.save();
        await userModel.findByIdAndUpdate(req.userId,{cartData:{}});

        const line_items = req.body.items.map((item)=>({
            price_data:{
                currency:"php",
                product_data:{
                    name:item.name  
                },
                unit_amount:item.price*100*1
            },
            quantity:item.quantity
        }))

        line_items.push({
            price_data:{
                currency:"php",
                product_data:{
                    name:"Delivery Fee",
                },
                unit_amount:2*100*1
            },
            quantity:1
        })

        const session = await stripe.checkout.sessions.create({
            line_items:line_items,
            mode:"payment",
            success_url:`${frontend_url}/verify?success=true&orderId=${newOrder._id}`,
            cancel_url:`${frontend_url}/verify?success=false&orderId=${newOrder._id}`,
        })

        res.json({success:true,url:session.url});
        
    } catch (error) {
        console.log(error);
        res.json({success:false,message:"Internal server error"});
    }
}

const verifyOrder = async (req,res) => {
    const {orderId,success} = req.body;
    try {
        if (success=="true") {
            await orderModel.findByIdAndUpdate(orderId,{payment:true});
            res.json({success:true,message:"Payment successful"});
        }
        else {
            await orderModel.findByIdAndDelete(orderId);
            res.json({success:false,message:"Payment failed"});
        }
    } catch (error) {
        console.log(error);
        res.json({success:false,message:"Internal server error"})
    }
}

// Users orders for frontend
const userOrders = async (req,res) => {
    try {
        const orders = await orderModel.find({userId:req.userId});
        res.json({success:true,data:orders});
    } catch (error) {
        console.log(error);
        res.json({success:false,message:"Internal server error"});
    }
}

// List of orders for admin
const listOrders = async (req,res) => {
    try {
        const orders = await orderModel.find({});
        res.json({success:true,data:orders});
    } catch (error) {
        console.log(error);
        res.json({success:false,message:"Internal server error"});
    }
}

// API for updating the status of the order
const updateOrderStatus = async (req,res) => {
    try {
        await orderModel.findByIdAndUpdate(req.body.orderId,{status:req.body.status});
        res.json({success:true,message:"Order status updated successfully"});
    } catch (error) {
        console.log(error);
        res.json({success:false,message:"Internal server error"});
    }
}

// Update currentLocation for an order (used by drivers or demo scripts)
const updateOrderLocation = async (req,res) => {
    try {
        const { orderId, location } = req.body;
        if (!orderId || !location) return res.json({success:false,message:'orderId and location required'});
        await orderModel.findByIdAndUpdate(orderId,{currentLocation:location});
        res.json({success:true,message:'Location updated'});
    } catch (error) {
        console.log(error);
        res.json({success:false,message:"Internal server error"});
    }
}


export {placeOrder,verifyOrder,userOrders,listOrders,updateOrderStatus,trackOrder,updateOrderLocation};

// Return current tracking location for an order (if available) or delivery address / simulated location
const trackOrder = async (req,res) => {
    try {
        const orderId = req.params.orderId;
        const order = await orderModel.findById(orderId);
        if (!order) return res.json({success:false,message:'Order not found'});

        if (order.currentLocation && order.currentLocation.lat && order.currentLocation.lng) {
            return res.json({success:true,location:order.currentLocation});
        }

        // If order.address contains lat/lng, return that as delivery address location
        if (order.address && order.address.lat && order.address.lng) {
            return res.json({success:true,location:{lat:order.address.lat,lng:order.address.lng,name:order.address.address || 'Delivery Address'}});
        }

        // Fallback: return a simulated location (small random offset)
        const baseLat = 14.5995; // Manila center fallback
        const baseLng = 120.9842;
        const lat = baseLat + (Math.random()-0.5)*0.02;
        const lng = baseLng + (Math.random()-0.5)*0.02;
        return res.json({success:true,location:{lat,lng,name:'Simulated order location'}});
    } catch (error) {
        console.log(error);
        res.json({success:false,message:"Internal server error"});
    }
}

 