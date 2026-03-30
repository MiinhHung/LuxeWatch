import { Request, Response } from 'express';
import { prisma } from '../utils/prisma';

export const getCategories = async (req: Request, res: Response) => {
  try {
    const categories = await prisma.category.findMany();
    res.json(categories);
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getCategoryById = async (req: Request, res: Response) => {
  try {
    const category = await prisma.category.findUnique({
      where: { id: Number(req.params.id) },
    });
    if (category) {
      res.json(category);
    } else {
      res.status(404).json({ success: false, message: 'Category not found' });
    }
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createCategory = async (req: Request, res: Response) => {
  try {
    const { name, description } = req.body;
    const categoryExists = await prisma.category.findUnique({ where: { name } });
    if (categoryExists) {
      res.status(400);
      throw new Error('Category already exists');
    }
    const category = await prisma.category.create({
      data: { name, description },
    });
    res.status(201).json(category);
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateCategory = async (req: Request, res: Response) => {
  try {
    const { name, description } = req.body;
    const category = await prisma.category.update({
      where: { id: Number(req.params.id) },
      data: { name, description },
    });
    res.json(category);
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteCategory = async (req: Request, res: Response) => {
  try {
    await prisma.category.delete({
      where: { id: Number(req.params.id) },
    });
    res.json({ success: true, message: 'Category removed' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
