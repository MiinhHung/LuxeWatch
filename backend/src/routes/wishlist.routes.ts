import express from 'express';
import { getWishlist, addToWishlist, removeFromWishlist } from '../controllers/wishlist.controller';
import { protect } from '../middlewares/authMiddleware';

const router = express.Router();

router.route('/').get(protect, getWishlist).post(protect, addToWishlist);
router.route('/:productId').delete(protect, removeFromWishlist);

export default router;
