import express from 'express';
import { validateCoupon, getCoupons, createCoupon, deleteCoupon } from '../controllers/coupon.controller';
import { protect, admin } from '../middlewares/authMiddleware';

const router = express.Router();

router.post('/validate', protect, validateCoupon);
router.get('/', protect, admin, getCoupons);
router.post('/', protect, admin, createCoupon);
router.delete('/:id', protect, admin, deleteCoupon);

export default router;
