import express from 'express';
import { createProductReview } from '../controllers/review.controller';
import { protect } from '../middlewares/authMiddleware';

const router = express.Router();

router.route('/:id/reviews').post(protect, createProductReview);

export default router;
