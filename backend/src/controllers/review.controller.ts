import { Response } from 'express';
import { prisma } from '../utils/prisma';
import { AuthRequest } from '../middlewares/authMiddleware';

export const createProductReview = async (req: AuthRequest, res: Response) => {
  try {
    const { rating, comment } = req.body;
    const productId = Number(req.params.id);

    const product = await prisma.product.findUnique({
      where: { id: productId },
      include: { reviews: true },
    });

    if (product) {
      const alreadyReviewed = product.reviews.find(
        (r: any) => r.userId === req.user!.id
      );

      if (alreadyReviewed) {
        res.status(400);
        throw new Error('Product already reviewed');
      }

      // 🚨 Purchase Verification Check
      const hasPurchased = await prisma.order.findFirst({
        where: {
          userId: req.user!.id,
          status: 'delivered',
          orderItems: {
            some: {
              productId: productId,
            },
          },
        },
      });

      if (!hasPurchased) {
        res.status(401).json({ success: false, message: 'You must purchase this product and have it delivered before leaving a review.' });
        return;
      }

      await prisma.review.create({
        data: {
          rating: Number(rating),
          comment,
          productId,
          userId: req.user!.id,
        },
      });

      const numReviews = product.reviews.length + 1;
      const avgRating =
        (product.reviews.reduce((acc: number, item: any) => item.rating + acc, 0) + Number(rating)) /
        numReviews;

      await prisma.product.update({
        where: { id: productId },
        data: {
          rating: avgRating,
          reviewsCount: numReviews,
        },
      });

      res.status(201).json({ success: true, message: 'Review added' });
    } else {
      res.status(404).json({ success: false, message: 'Product not found' });
    }
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
