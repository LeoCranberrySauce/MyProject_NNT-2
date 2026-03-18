import promoCodeModel from "../models/promoCodeModel.js";
import 'dotenv/config';
import { connectDB } from "../config/db.js";

const seedPromoCodes = async () => {
    await connectDB();
    
    const promoCodes = [
        {
            name: "Welcome Offer",
            description: "Get 10% off your first order!",
            code: "WELCOME10",
            discountType: "percentage",
            discountValue: 10,
            minOrderAmount: 0,
            maxDiscount: 50,
            expiresAt: new Date("2026-12-31"),
            isActive: true,
            usageLimit: null
        },
        {
            name: "Save 20% on Holidays",
            description: "Enjoy 20% off on all orders above PHP 100 for the first 100 orders uring the holiday season and get free perks in any stores!",
            code: "SAVE20",
            discountType: "percentage",
            discountValue: 20,
            minOrderAmount: 100,
            maxDiscount: 100,
            expiresAt: new Date("2026-12-31"),
            isActive: true,
            usageLimit: 100
        },
        {
            name: "Flat PHP 50 Off",
            description: "Get PHP 50 off on orders above PHP 200!",
            code: "FLAT50",
            discountType: "fixed",
            discountValue: 50,
            minOrderAmount: 200,
            maxDiscount: null,
            expiresAt: new Date("2026-12-31"),
            isActive: true,
            usageLimit: 50
        },
        {
            name: "Free Shipping",
            description: "Get free shipping on orders anywhere in the vicinity of your location!",
            code: "FREESHIP",
            discountType: "fixed",
            discountValue: 2,
            minOrderAmount: 0,
            maxDiscount: 2,
            expiresAt: new Date("2026-12-31"),
            isActive: true,
            usageLimit: null
        }
    ];

    try {
        for (const promo of promoCodes) {
            const existing = await promoCodeModel.findOne({ code: promo.code });
            if (!existing) {
                await promoCodeModel.create(promo);
                console.log(`Created promo code: ${promo.code}`);
            } else {
                console.log(`Promo code ${promo.code} already exists`);
            }
        }
        console.log("Seeding completed!");
    } catch (error) {
        console.error("Error seeding promo codes:", error);
    }
    
    process.exit(0);
};

seedPromoCodes();
