import mongoose from "mongoose";

const promoCodeSchema = new mongoose.Schema({
    name: {type: String, required: true},
    description: {type: String, required: true},
    code: { type: String, required: true, unique: true },
    discountType: { type: String, enum: ['percentage', 'fixed'], required: true },
    discountValue: { type: Number, required: true },
    minOrderAmount: { type: Number, default: 0 },
    maxDiscount: { type: Number, default: null },
    expiresAt: { type: Date, required: true },
    isActive: { type: Boolean, default: true },
    usageLimit: { type: Number, default: null },
    usedCount: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now }
})

const promoCodeModel = mongoose.models.promoCodes || mongoose.model("promoCodes", promoCodeSchema);

export default promoCodeModel;
