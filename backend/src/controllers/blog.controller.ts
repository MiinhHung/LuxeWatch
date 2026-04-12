import { Request, Response } from 'express';
import { prisma } from '../utils/prisma';

// @desc    Get all blog posts
// @route   GET /api/blogs
// @access  Public
export const getBlogPosts = async (req: Request, res: Response) => {
  try {
    const { category } = req.query;
    const filter = category ? { category: String(category) } : {};

    const posts = await prisma.blogPost.findMany({
      where: filter,
      orderBy: { createdAt: 'desc' },
    });

    res.json(posts);
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single blog post by slug
// @route   GET /api/blogs/:slug
// @access  Public
export const getBlogPostBySlug = async (req: Request, res: Response) => {
  try {
    const post = await prisma.blogPost.findUnique({
      where: { slug: String(req.params.slug) },
    });

    if (post) {
      res.json(post);
    } else {
      res.status(404).json({ success: false, message: 'Article not found' });
    }
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single blog post by ID
// @route   GET /api/blogs/id/:id
// @access  Private/Admin
export const getBlogPostById = async (req: Request, res: Response) => {
  try {
    const post = await prisma.blogPost.findUnique({
      where: { id: Number(req.params.id) },
    });

    if (post) {
      res.json(post);
    } else {
      res.status(404).json({ success: false, message: 'Article not found' });
    }
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create a blog post
// @route   POST /api/blogs
// @access  Private/Admin
export const createBlogPost = async (req: Request, res: Response) => {
  try {
    const { title, slug, content, excerpt, image, category, author } = req.body;

    const postExists = await prisma.blogPost.findUnique({ where: { slug } });
    if (postExists) {
      return res.status(400).json({ success: false, message: 'Slug already exists' });
    }

    const post = await prisma.blogPost.create({
      data: {
        title,
        slug,
        content,
        excerpt,
        image,
        category,
        author: author || 'LuxeTime Editorial',
      },
    });

    res.status(201).json(post);
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update a blog post
// @route   PUT /api/blogs/:id
// @access  Private/Admin
export const updateBlogPost = async (req: Request, res: Response) => {
  try {
    const { title, slug, content, excerpt, image, category, author } = req.body;

    const postExists = await prisma.blogPost.findUnique({
      where: { id: Number(req.params.id) },
    });

    if (postExists) {
      const updatedPost = await prisma.blogPost.update({
        where: { id: Number(req.params.id) },
        data: {
          title: title || postExists.title,
          slug: slug || postExists.slug,
          content: content || postExists.content,
          excerpt: excerpt || postExists.excerpt,
          image: image || postExists.image,
          category: category || postExists.category,
          author: author || postExists.author,
        },
      });

      res.json(updatedPost);
    } else {
      res.status(404).json({ success: false, message: 'Article not found' });
    }
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete a blog post
// @route   DELETE /api/blogs/:id
// @access  Private/Admin
export const deleteBlogPost = async (req: Request, res: Response) => {
  try {
    const post = await prisma.blogPost.findUnique({
      where: { id: Number(req.params.id) },
    });

    if (post) {
      await prisma.blogPost.delete({
        where: { id: Number(req.params.id) },
      });
      res.json({ success: true, message: 'Article removed' });
    } else {
      res.status(404).json({ success: false, message: 'Article not found' });
    }
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
