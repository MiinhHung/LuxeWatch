import express from 'express';
import { 
  getBlogPosts, 
  getBlogPostBySlug, 
  getBlogPostById,
  createBlogPost,
  updateBlogPost,
  deleteBlogPost
} from '../controllers/blog.controller';
import { protect, admin } from '../middlewares/authMiddleware';

const router = express.Router();

// Public routes
router.get('/', getBlogPosts);
router.get('/:slug', getBlogPostBySlug);

// Admin routes
router.get('/id/:id', protect, admin, getBlogPostById);
router.post('/', protect, admin, createBlogPost);
router.put('/:id', protect, admin, updateBlogPost);
router.delete('/:id', protect, admin, deleteBlogPost);

export default router;
