import express from 'express';
import { createSubscription, getSubscriptions } from '../controllers/subscription.controller';
import { protect, admin } from '../middlewares/authMiddleware';

const router = express.Router();

router.route('/').post(createSubscription).get(protect, admin, getSubscriptions);

export default router;
