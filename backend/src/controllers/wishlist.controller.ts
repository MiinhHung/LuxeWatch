import { Response } from 'express';
import { prisma } from '../utils/prisma';
import { AuthRequest } from '../middlewares/authMiddleware';

export const getWishlist = async (req: AuthRequest, res: Response) => {
  try {
    let wishlist = await prisma.wishlist.findUnique({
      where: { userId: req.user!.id },
      include: { items: { include: { product: true } } },
    });

    if (!wishlist) {
      wishlist = await prisma.wishlist.create({
        data: { userId: req.user!.id },
        include: { items: { include: { product: true } } },
      });
    }

    res.json(wishlist);
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const addToWishlist = async (req: AuthRequest, res: Response) => {
  try {
    const productId = Number(req.body.productId);
    
    let wishlist = await prisma.wishlist.findUnique({
      where: { userId: req.user!.id },
    });

    if (!wishlist) {
      wishlist = await prisma.wishlist.create({
        data: { userId: req.user!.id },
      });
    }

    const itemExists = await prisma.wishlistItem.findUnique({
      where: {
        wishlistId_productId: {
          wishlistId: wishlist.id,
          productId,
        },
      },
    });

    if (!itemExists) {
      await prisma.wishlistItem.create({
        data: {
          wishlistId: wishlist.id,
          productId,
        },
      });
    }

    res.status(201).json({ success: true, message: 'Item added to wishlist' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const removeFromWishlist = async (req: AuthRequest, res: Response) => {
  try {
    const productId = Number(req.params.productId);
    
    const wishlist = await prisma.wishlist.findUnique({
      where: { userId: req.user!.id },
    });

    if (wishlist) {
      await prisma.wishlistItem.deleteMany({
        where: {
          wishlistId: wishlist.id,
          productId,
        },
      });
      res.json({ success: true, message: 'Item removed from wishlist' });
    } else {
      res.status(404).json({ success: false, message: 'Wishlist not found' });
    }
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
