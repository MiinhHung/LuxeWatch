import { Response } from 'express';
import { prisma } from '../utils/prisma';
import { AuthRequest } from '../middlewares/authMiddleware';

// @desc  Get all users
// @route GET /api/users
// @access Private/Admin
export const getUsers = async (req: AuthRequest, res: Response) => {
  try {
    const users = await prisma.user.findMany({
      select: { id: true, fullName: true, email: true, role: true, createdAt: true },
      orderBy: { createdAt: 'desc' },
    });
    res.json(users);
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc  Delete user
// @route DELETE /api/users/:id
// @access Private/Admin
export const deleteUser = async (req: AuthRequest, res: Response) => {
  try {
    const user = await prisma.user.findUnique({ where: { id: Number(req.params.id) } });
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    if (user.role === 'admin') return res.status(400).json({ success: false, message: 'Cannot delete admin user' });
    await prisma.user.delete({ where: { id: Number(req.params.id) } });
    res.json({ success: true, message: 'User removed' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc  Update user role
// @route PUT /api/users/:id/role
// @access Private/Admin
export const updateUserRole = async (req: AuthRequest, res: Response) => {
  try {
    const { role } = req.body;
    const user = await prisma.user.update({
      where: { id: Number(req.params.id) },
      data: { role },
      select: { id: true, fullName: true, email: true, role: true },
    });
    res.json(user);
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc  Get admin statistics
// @route GET /api/users/stats
// @access Private/Admin
export const getStats = async (req: AuthRequest, res: Response) => {
  try {
    const [
      totalOrders,
      totalUsers,
      totalProducts,
      revenueResult,
      recentOrders,
      ordersByStatus,
    ] = await Promise.all([
      prisma.order.count(),
      prisma.user.count(),
      prisma.product.count(),
      prisma.order.aggregate({ 
        _sum: { totalAmount: true }, 
        where: { 
          OR: [
            { paymentStatus: 'paid' },
            { status: 'delivered' }
          ]
        } 
      }),
      prisma.order.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: { user: { select: { fullName: true } } },
      }),
      prisma.order.groupBy({
        by: ['status'],
        _count: { status: true },
      }),
    ]);

    res.json({
      totalOrders,
      totalUsers,
      totalProducts,
      totalRevenue: revenueResult._sum.totalAmount || 0,
      recentOrders,
      ordersByStatus,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
