import express from 'express';
import { createPaymentUrl, verifyPayment, ipnPayment } from '../controllers/payment.controller';
import { protect } from '../middlewares/authMiddleware';

const router = express.Router();

router.post('/create_payment_url', protect, createPaymentUrl);
router.get('/vnpay_return', verifyPayment);
router.get('/vnpay_ipn', ipnPayment);
router.get('/verify', verifyPayment);

export default router;
