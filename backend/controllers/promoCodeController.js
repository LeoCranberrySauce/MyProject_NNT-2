import promoCodeModel from "../models/promoCodeModel.js";

const validatePromoCode = async (req, res) => {
    try {
        const { code, orderAmount } = req.body;
        
        const promo = await promoCodeModel.findOne({ 
            code: code.toUpperCase(),
            isActive: true 
        });

        if (!promo) {
            return res.json({ success: false, message: "Invalid promo code" });
        }

        if (new Date() > new Date(promo.expiresAt)) {
            return res.json({ success: false, message: "Promo code has expired" });
        }

        if (promo.usageLimit && promo.usedCount >= promo.usageLimit) {
            return res.json({ success: false, message: "Promo code usage limit reached" });
        }

        if (orderAmount < promo.minOrderAmount) {
            return res.json({ 
                success: false, 
                message: `Minimum order amount of PHP ${promo.minOrderAmount} required` 
            });
        }

        let discount = 0;
        if (promo.discountType === 'percentage') {
            discount = (orderAmount * promo.discountValue) / 100;
            if (promo.maxDiscount) {
                discount = Math.min(discount, promo.maxDiscount);
            }
        } else {
            discount = Math.min(promo.discountValue, orderAmount);
        }

        return res.json({ 
            success: true, 
            message: "Promo code applied",
            promoCode: {
                code: promo.code,
                discountType: promo.discountType,
                discountValue: promo.discountValue,
                discount: discount
            }
        });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error validating promo code" });
    }
};

const createPromoCode = async (req, res) => {
    try {
        const { code, discountType, discountValue, minOrderAmount, maxDiscount, expiresAt, usageLimit } = req.body;

        const existingCode = await promoCodeModel.findOne({ code: code.toUpperCase() });
        if (existingCode) {
            return res.json({ success: false, message: "Promo code already exists" });
        }

        const newPromo = new promoCodeModel({
            code: code.toUpperCase(),
            discountType,
            discountValue,
            minOrderAmount: minOrderAmount || 0,
            maxDiscount,
            expiresAt,
            usageLimit
        });

        await newPromo.save();
        res.json({ success: true, message: "Promo code created successfully" });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error creating promo code" });
    }
};

const incrementPromoUsage = async (code) => {
    try {
        await promoCodeModel.findOneAndUpdate(
            { code: code.toUpperCase() },
            { $inc: { usedCount: 1 } }
        );
    } catch (error) {
        console.log("Error incrementing promo usage:", error);
    }
};

const listPromoCodes = async (req, res) => {
    try {
        const promos = await promoCodeModel.find({});
        res.json({ success: true, data: promos });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error fetching promo codes" });
    }
};

const togglePromoCode = async (req, res) => {
    try {
        const { code, isActive } = req.body;
        await promoCodeModel.findOneAndUpdate(
            { code: code.toUpperCase() },
            { isActive }
        );
        res.json({ success: true, message: "Promo code updated" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error updating promo code" });
    }
};

const deletePromoCode = async (req, res) => {
    try {
        const { code } = req.body;
        await promoCodeModel.findOneAndDelete({ code: code.toUpperCase() });
        res.json({ success: true, message: "Promo code deleted" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error deleting promo code" });
    }
};

export { validatePromoCode, createPromoCode, incrementPromoUsage, listPromoCodes, togglePromoCode, deletePromoCode };
