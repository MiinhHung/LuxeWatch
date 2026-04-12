import { Response } from 'express';
import { prisma } from '../utils/prisma';
import { AuthRequest } from '../middlewares/authMiddleware';

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
export const addOrderItems = async (req: AuthRequest, res: Response) => {
  try {
    const { orderItems, shippingAddress, totalAmount, paymentMethod, couponCode } = req.body;

    if (orderItems && orderItems.length === 0) {
      res.status(400);
      throw new Error('No order items');
    } else {
      let finalTotal = totalAmount;
      let discountValue = 0;

      // Validate coupon if provided
      if (couponCode) {
        const coupon = await prisma.coupon.findUnique({
          where: { code: couponCode, isActive: true },
        });

        if (coupon) {
          discountValue = Number(coupon.discountAmount);
          finalTotal = totalAmount - discountValue;
          if (finalTotal < 0) finalTotal = 0;
        }
      }

      const order = await prisma.order.create({
        data: {
          userId: req.user!.id,
          totalAmount: finalTotal,
          discountAmount: discountValue,
          couponCode: couponCode || null,
          paymentMethod: paymentMethod || 'vnpay',
          shippingAddress: JSON.stringify(shippingAddress),
          orderItems: {
            create: orderItems.map((item: any) => ({
              productId: item.productId,
              quantity: item.qty,
              price: item.price,
            })),
          },
        },
        include: {
          orderItems: true,
        },
      });

      res.status(201).json(order);
    }
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
export const getOrderById = async (req: AuthRequest, res: Response) => {
  try {
    const order = await prisma.order.findUnique({
      where: { id: Number(req.params.id) },
      include: {
        user: { select: { id: true, fullName: true, email: true } },
        orderItems: { include: { product: true } },
      },
    });

    if (order) {
      if (order.userId === req.user!.id || req.user!.role === 'admin') {
        res.json(order);
      } else {
        res.status(403).json({ success: false, message: 'Not authorized to view this order' });
      }
    } else {
      res.status(404).json({ success: false, message: 'Order not found' });
    }
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update order to paid (simulated for now before VNPAY)
// @route   PUT /api/orders/:id/pay
// @access  Private
export const updateOrderToPaid = async (req: AuthRequest, res: Response) => {
  try {
    const order = await prisma.order.findUnique({
      where: { id: Number(req.params.id) },
    });

    if (order) {
      const updatedOrder = await prisma.order.update({
        where: { id: Number(req.params.id) },
        data: {
          paymentStatus: 'paid',
        },
      });

      res.json(updatedOrder);
    } else {
      res.status(404).json({ success: false, message: 'Order not found' });
    }
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update order to delivered
// @route   PUT /api/orders/:id/deliver
// @access  Private/Admin
export const updateOrderToDelivered = async (req: AuthRequest, res: Response) => {
  try {
    const order = await prisma.order.findUnique({
      where: { id: Number(req.params.id) },
    });

    if (order) {
      const updatedOrder = await prisma.order.update({
        where: { id: Number(req.params.id) },
        data: {
          status: 'delivered',
          paymentStatus: 'paid', // Assuming delivery implies completion/payment for admin manual tracking
        },
      });

      res.json(updatedOrder);
    } else {
      res.status(404).json({ success: false, message: 'Order not found' });
    }
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private
export const getMyOrders = async (req: AuthRequest, res: Response) => {
  try {
    const orders = await prisma.order.findMany({
      where: { userId: req.user!.id },
      include: { orderItems: { include: { product: true } } },
      orderBy: { createdAt: 'desc' },
    });
    res.json(orders);
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private/Admin
export const getOrders = async (req: AuthRequest, res: Response) => {
  try {
    const orders = await prisma.order.findMany({
      include: { 
        user: { select: { id: true, fullName: true } }, 
        orderItems: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                stock: true
              }
            }
          }
        } 
      },
      orderBy: { createdAt: 'desc' },
    });
    res.json(orders);
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
