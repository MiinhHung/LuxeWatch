import express from 'express';
import { getUsers, deleteUser, updateUserRole, getStats } from '../controllers/user.controller';
import { protect, admin } from '../middlewares/authMiddleware';

const router = express.Router();

router.get('/stats', protect, admin, getStats);
router.get('/', protect, admin, getUsers);
router.delete('/:id', protect, admin, deleteUser);
router.put('/:id/role', protect, admin, updateUserRole);

export default router;
