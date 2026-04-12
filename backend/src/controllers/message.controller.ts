import { Response } from 'express';
import { prisma } from '../utils/prisma';
import { AuthRequest } from '../middlewares/authMiddleware';

// @desc    Send a message
// @route   POST /api/messages
// @access  Private
export const sendMessage = async (req: AuthRequest, res: Response) => {
  try {
    const { receiverId, content } = req.body;
    const senderId = req.user!.id;
    const senderRole = req.user!.role;

    // Create the message from the user
    const message = await prisma.message.create({
      data: {
        senderId,
        receiverId: Number(receiverId),
        content,
      },
      include: {
        sender: { select: { id: true, fullName: true, role: true } },
        receiver: { select: { id: true, fullName: true, role: true } },
      },
    });

    // Auto-reply logic: If sender is not admin, send an automated response from admin
    if (senderRole !== 'admin') {
      const adminUser = await prisma.user.findFirst({
        where: { role: 'admin' },
        select: { id: true }
      });

      if (adminUser && adminUser.id !== senderId) {
        // We delay the auto-reply slightly to make it feel more natural (optional but nice)
        // For simplicity in a basic API, we just create it immediately
        await prisma.message.create({
          data: {
            senderId: adminUser.id,
            receiverId: senderId,
            content: 'Hello, thank you for contacting us. Your message has been received, and we will get back to you as soon as possible. While waiting for us, you can use code WELCOME to get $500 off your order!',
          }
        });
      }
    }

    res.status(201).json(message);
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get conversation between logged in user and another user
// @route   GET /api/messages/:userId
// @access  Private
export const getConversation = async (req: AuthRequest, res: Response) => {
  try {
    const otherUserId = Number(req.params.userId);
    const userId = req.user!.id;

    const messages = await prisma.message.findMany({
      where: {
        OR: [
          { senderId: userId, receiverId: otherUserId },
          { senderId: otherUserId, receiverId: userId },
        ],
      },
      orderBy: { createdAt: 'asc' },
      include: {
        sender: { select: { id: true, fullName: true } },
      },
    });

    res.json(messages);
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get list of users who have conversations with the admin (Admin only)
// @route   GET /api/messages/admin/conversations
// @access  Private/Admin
export const getAdminConversations = async (req: AuthRequest, res: Response) => {
  try {
    // This finds unique users who sent messages to or received messages from admin
    const adminId = req.user!.id;

    // Get all messages involving admin
    const messages = await prisma.message.findMany({
      where: {
        OR: [{ senderId: adminId }, { receiverId: adminId }],
      },
      include: {
        sender: { select: { id: true, fullName: true, email: true } },
        receiver: { select: { id: true, fullName: true, email: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    // Extract unique users (excluding admin)
    const userMap = new Map();
    messages.forEach((msg) => {
      const otherUser = msg.senderId === adminId ? msg.receiver : msg.sender;
      if (otherUser.id !== adminId && !userMap.has(otherUser.id)) {
        userMap.set(otherUser.id, {
          ...otherUser,
          lastMessage: msg.content,
          lastMessageDate: msg.createdAt,
        });
      }
    });

    res.json(Array.from(userMap.values()));
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
