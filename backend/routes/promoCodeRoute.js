import express from 'express';
import { validatePromoCode, createPromoCode, updatePromoCode, listPromoCodes, togglePromoCode, deletePromoCode } from '../controllers/promoCodeController.js';
import { verifyAdmin, authMiddleware } from '../middleware/auth.js';
import promoCodeModel from '../models/promoCodeModel.js';

const promoCodeRouter = express.Router();

promoCodeRouter.post('/validate', authMiddleware, validatePromoCode);
promoCodeRouter.post('/create', verifyAdmin, createPromoCode);
promoCodeRouter.post('/update', verifyAdmin, updatePromoCode);
promoCodeRouter.get('/list', verifyAdmin, listPromoCodes);
promoCodeRouter.get('/public-list', listPromoCodes); // Public endpoint for promotional banner
promoCodeRouter.post('/toggle', verifyAdmin, togglePromoCode);
promoCodeRouter.post('/delete', verifyAdmin, deletePromoCode);
promoCodeRouter.post('/increment-usage', authMiddleware, async (req, res) => {
    try {
        const { code } = req.body;
        await promoCodeModel.findOneAndUpdate(
            { code: code.toUpperCase() },
            { $inc: { usedCount: 1 } }
        );
        res.json({ success: true, message: "Promo code usage incremented" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error incrementing promo usage" });
    }
});

export default promoCodeRouter;
