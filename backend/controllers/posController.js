import orderModel from "../models/orderModel.js";
import tableModel from "../models/tableModel.js";
import foodModel from "../models/foodModel.js";
import { incrementPromoUsage } from "./promoCodeController.js";

// Generate receipt number
const generateReceiptNumber = () => {
    const now = new Date();
    const dateStr = now.toISOString().slice(0, 10).replace(/-/g, '');
    const timeStr = now.toTimeString().slice(0, 8).replace(/:/g, '');
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `POS-${dateStr}-${timeStr}-${random}`;
};

// Place a POS (in-store) order
const placePosOrder = async (req, res) => {
    try {
        const { items, amount, paymentMethod, orderType, tableNumber, staffName, promoCode, customerName } = req.body;

        if (!items || items.length === 0) {
            return res.json({ success: false, message: "Order must have at least one item" });
        }

        // Deduct stock
        for (const item of items) {
            if (item._id && item.quantity) {
                await foodModel.findByIdAndUpdate(item._id, { 
                    $inc: { stock: -item.quantity } 
                });
            }
        }

        const receiptNumber = generateReceiptNumber();

        const newOrder = new orderModel({
            userId: req.userId || 'pos-system',
            items: items,
            amount: amount,
            address: { address: customerName || 'Walk-in Customer' },
            orderType: orderType || 'dine-in',
            tableNumber: tableNumber || null,
            payment: paymentMethod !== 'unpaid' ? true : false,
            paymentMethod: paymentMethod || 'unpaid',
            staffName: staffName || 'Staff',
            receiptNumber: receiptNumber,
            status: orderType === 'dine-in' ? 'Food Processing' : 'Food Processing',
            promoCode: promoCode || null
        });

        await newOrder.save();

        // If promo code was used, increment usage
        if (promoCode && promoCode.code) {
            try {
                await incrementPromoUsage(promoCode.code);
            } catch (e) {
                console.log("Promo usage increment skipped:", e.message);
            }
        }

        // If dine-in and table number provided, update table status
        if (orderType === 'dine-in' && tableNumber) {
            const table = await tableModel.findOneAndUpdate(
                { tableNumber: tableNumber },
                { status: 'occupied', currentOrderId: newOrder._id },
                { new: true }
            );
            if (!table) {
                console.log(`Table ${tableNumber} not found, skipping table status update`);
            }
        }

        res.json({
            success: true,
            message: "Order placed successfully",
            data: {
                order: newOrder,
                receiptNumber: receiptNumber
            }
        });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error placing order: " + error.message });
    }
};

// Get POS orders (recent orders for POS interface)
const getPosOrders = async (req, res) => {
    try {
        const orders = await orderModel.find({
            $or: [
                { orderType: 'dine-in' },
                { orderType: 'takeaway' }
            ]
        }).sort({ createdAt: -1 }).limit(50);
        
        res.json({ success: true, data: orders });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error fetching POS orders" });
    }
};

// Get active dine-in orders (ongoing)
const getActiveDineInOrders = async (req, res) => {
    try {
        const orders = await orderModel.find({
            orderType: 'dine-in',
            status: { $nin: ['Delivered', 'Cancelled', 'Completed'] }
        }).sort({ createdAt: -1 });
        
        res.json({ success: true, data: orders });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error fetching active orders" });
    }
};

// Void/cancel a POS order
const voidOrder = async (req, res) => {
    try {
        const { orderId } = req.body;
        const order = await orderModel.findByIdAndUpdate(
            orderId,
            { status: 'Cancelled', payment: false },
            { new: true }
        );
        
        if (!order) return res.json({ success: false, message: "Order not found" });

        // Restore stock
        if (order.items) {
            for (const item of order.items) {
                if (item._id && item.quantity) {
                    await foodModel.findByIdAndUpdate(item._id, { 
                        $inc: { stock: item.quantity } 
                    });
                }
            }
        }

        // Free up table if dine-in
        if (order.tableNumber) {
            await tableModel.findOneAndUpdate(
                { tableNumber: order.tableNumber },
                { status: 'available', currentOrderId: null }
            );
        }

        res.json({ success: true, message: "Order voided successfully", data: order });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error voiding order" });
    }
};

// Complete order (mark as completed/paid)
const completeOrder = async (req, res) => {
    try {
        const { orderId, paymentMethod } = req.body;
        const updateData = { status: 'Completed', payment: true };
        if (paymentMethod) updateData.paymentMethod = paymentMethod;

        const order = await orderModel.findByIdAndUpdate(orderId, updateData, { new: true });
        if (!order) return res.json({ success: false, message: "Order not found" });

        // Free up table if dine-in
        if (order.tableNumber) {
            await tableModel.findOneAndUpdate(
                { tableNumber: order.tableNumber },
                { status: 'available', currentOrderId: null }
            );
        }

        res.json({ success: true, message: "Order completed", data: order });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error completing order" });
    }
};

// Get today's POS sales summary
const getPosSalesSummary = async (req, res) => {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        const orders = await orderModel.find({
            createdAt: { $gte: today, $lt: tomorrow },
            $or: [{ orderType: 'dine-in' }, { orderType: 'takeaway' }]
        });

        const totalOrders = orders.length;
        const totalRevenue = orders.reduce((sum, o) => sum + o.amount, 0);
        const paidOrders = orders.filter(o => o.payment).length;
        const unpaidOrders = orders.filter(o => !o.payment).length;

        res.json({
            success: true,
            data: {
                totalOrders,
                totalRevenue,
                paidOrders,
                unpaidOrders,
                ordersByType: {
                    dineIn: orders.filter(o => o.orderType === 'dine-in').length,
                    takeaway: orders.filter(o => o.orderType === 'takeaway').length
                }
            }
        });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error fetching sales summary" });
    }
};

// Get receipt by order ID
const getReceipt = async (req, res) => {
    try {
        const order = await orderModel.findById(req.params.orderId);
        if (!order) return res.json({ success: false, message: "Order not found" });
        res.json({ success: true, data: order });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error fetching receipt" });
    }
};

export { placePosOrder, getPosOrders, getActiveDineInOrders, voidOrder, completeOrder, getPosSalesSummary, getReceipt };