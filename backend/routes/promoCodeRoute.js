import express from 'express';
import { validatePromoCode, createPromoCode, listPromoCodes, togglePromoCode, deletePromoCode } from '../controllers/promoCodeController.js';
import { verifyToken, verifyAdmin } from '../middleware/auth.js';

const promoCodeRouter = express.Router();

promoCodeRouter.post('/validate', verifyToken, validatePromoCode);
promoCodeRouter.post('/create', verifyAdmin, createPromoCode);
promoCodeRouter.get('/list', verifyAdmin, listPromoCodes);
promoCodeRouter.post('/toggle', verifyAdmin, togglePromoCode);
promoCodeRouter.post('/delete', verifyAdmin, deletePromoCode);

export default promoCodeRouter;
