import express from 'express';
import { protect, admin } from '../middlewares/authMiddleware';
import { 
  sendMessage, 
  getConversation, 
  getAdminConversations 
} from '../controllers/message.controller';

const router = express.Router();

router.route('/')
  .post(protect, sendMessage);

router.route('/admin/conversations')
  .get(protect, admin, getAdminConversations);

router.route('/:userId')
  .get(protect, getConversation);

export default router;
