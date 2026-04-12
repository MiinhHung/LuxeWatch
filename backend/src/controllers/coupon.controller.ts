import { Request, Response } from 'express';
import { prisma } from '../utils/prisma';

// @desc    Validate a coupon code
// @route   POST /api/coupons/validate
// @access  Private
export const validateCoupon = async (req: Request, res: Response) => {
  try {
    const { code } = req.body;

    const coupon = await prisma.coupon.findUnique({
      where: { code },
    });

    if (!coupon) {
      return res.status(404).json({ success: false, message: 'Coupon not found' });
    }

    if (!coupon.isActive) {
      return res.status(400).json({ success: false, message: 'Coupon is no longer active' });
    }

    res.json({
      success: true,
      code: coupon.code,
      discountAmount: coupon.discountAmount,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
// @desc    Get all coupons (Admin only)
// @route   GET /api/coupons
// @access  Private/Admin
export const getCoupons = async (req: Request, res: Response) => {
  try {
    const coupons = await prisma.coupon.findMany({
      orderBy: { createdAt: 'desc' },
    });
    res.json(coupons);
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create a coupon (Admin only)
// @route   POST /api/coupons
// @access  Private/Admin
export const createCoupon = async (req: Request, res: Response) => {
  try {
    const { code, discountAmount } = req.body;

    const existingCoupon = await prisma.coupon.findUnique({
      where: { code },
    });

    if (existingCoupon) {
      return res.status(400).json({ success: false, message: 'Coupon code already exists' });
    }

    const coupon = await prisma.coupon.create({
      data: {
        code: code.toUpperCase(),
        discountAmount: Number(discountAmount),
      },
    });

    res.status(201).json(coupon);
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete a coupon (Admin only)
// @route   DELETE /api/coupons/:id
// @access  Private/Admin
export const deleteCoupon = async (req: Request, res: Response) => {
  try {
    await prisma.coupon.delete({
      where: { id: Number(req.params.id) },
    });

    res.json({ success: true, message: 'Coupon deleted' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
