import { Request, Response } from 'express';
import { prisma } from '../utils/prisma';

export const createSubscription = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ success: false, message: 'Email is required' });
    }

    // Check if subscription already exists
    // @ts-ignore
    const subExists = await prisma.subscription.findUnique({
      where: { email },
    });

    if (subExists) {
      return res.status(400).json({ success: false, message: 'You are already in the inner circle!' });
    }

    // @ts-ignore
    const subscription = await prisma.subscription.create({
      data: { email },
    });

    res.status(201).json({ 
      success: true, 
      message: 'Welcome to the LuxeTime Inner Circle!', 
      subscription 
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Server error' });
  }
};

export const getSubscriptions = async (req: Request, res: Response) => {
  try {
    // @ts-ignore
    const subscriptions = await prisma.subscription.findMany({
      orderBy: { createdAt: 'desc' },
    });
    res.json({ success: true, subscriptions });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Server error' });
  }
};
