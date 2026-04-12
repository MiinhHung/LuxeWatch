import { Request, Response } from 'express';
import { prisma } from '../utils/prisma';

// @desc    Fetch all products
// @route   GET /api/products
// @access  Public
export const getProducts = async (req: Request, res: Response) => {
  try {
    const pageSize = Number(req.query.pageSize) || 1000;
    const page = Number(req.query.pageNumber) || 1;

    const keyword = req.query.keyword ? String(req.query.keyword) : '';
    const categoryId = req.query.categoryId ? Number(req.query.categoryId) : undefined;
    const brandId = req.query.brandId ? Number(req.query.brandId) : undefined;
    const minPrice = req.query.minPrice ? Number(req.query.minPrice) : undefined;
    const maxPrice = req.query.maxPrice ? Number(req.query.maxPrice) : undefined;

    const where: any = {
      AND: [
        keyword ? { name: { contains: keyword } } : {},
        categoryId ? { categoryId } : {},
        brandId ? { brandId } : {},
        minPrice !== undefined ? { price: { gte: minPrice } } : {},
        maxPrice !== undefined ? { price: { lte: maxPrice } } : {},
      ],
    };

    const count = await prisma.product.count({ where });
    const products = await prisma.product.findMany({
      where,
      skip: pageSize * (page - 1),
      take: pageSize,
      include: {
        category: true,
        brand: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json({ products, page, pages: Math.ceil(count / pageSize), count });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Fetch single product
// @route   GET /api/products/:id
// @access  Public
export const getProductById = async (req: Request, res: Response) => {
  try {
    const product = await prisma.product.findUnique({
      where: { id: Number(req.params.id) },
      include: {
        category: true,
        brand: true,
        reviews: { include: { user: { select: { fullName: true } } } },
      },
    });

    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ success: false, message: 'Product not found' });
    }
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin
export const createProduct = async (req: Request, res: Response) => {
  try {
    const { name, price, description, images, brandId, categoryId, stock } = req.body;

    const product = await prisma.product.create({
      data: {
        name,
        price,
        description,
        images: JSON.stringify(Array.isArray(images) ? images : JSON.parse(images || '[]')),
        brandId: Number(brandId),
        categoryId: Number(categoryId),
        stock: Number(stock),
      },
    });

    res.status(201).json(product);
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
export const updateProduct = async (req: Request, res: Response) => {
  try {
    const { name, price, description, images, brandId, categoryId, stock } = req.body;

    const productExists = await prisma.product.findUnique({
      where: { id: Number(req.params.id) },
    });

    if (productExists) {
      const updatedProduct = await prisma.product.update({
        where: { id: Number(req.params.id) },
        data: {
          name: name || productExists.name,
          price: price !== undefined ? price : productExists.price,
          description: description || productExists.description,
          images: images !== undefined
            ? JSON.stringify(Array.isArray(images) ? images : JSON.parse(images || '[]'))
            : productExists.images,
          brandId: brandId ? Number(brandId) : productExists.brandId,
          categoryId: categoryId ? Number(categoryId) : productExists.categoryId,
          stock: stock !== undefined ? Number(stock) : productExists.stock,
        },
      });

      res.json(updatedProduct);
    } else {
      res.status(404).json({ success: false, message: 'Product not found' });
    }
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const product = await prisma.product.findUnique({
      where: { id: Number(req.params.id) },
    });

    if (product) {
      await prisma.product.delete({
        where: { id: Number(req.params.id) },
      });
      res.json({ success: true, message: 'Product removed' });
    } else {
      res.status(404).json({ success: false, message: 'Product not found' });
    }
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
