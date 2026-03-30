import { Request, Response } from 'express';
import { prisma } from '../utils/prisma';

export const getBrands = async (req: Request, res: Response) => {
  try {
    const brands = await prisma.brand.findMany();
    res.json(brands);
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getBrandById = async (req: Request, res: Response) => {
  try {
    const brand = await prisma.brand.findUnique({
      where: { id: Number(req.params.id) },
    });
    if (brand) {
      res.json(brand);
    } else {
      res.status(404).json({ success: false, message: 'Brand not found' });
    }
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createBrand = async (req: Request, res: Response) => {
  try {
    const { name, description } = req.body;
    const brandExists = await prisma.brand.findUnique({ where: { name } });
    if (brandExists) {
      res.status(400);
      throw new Error('Brand already exists');
    }
    const brand = await prisma.brand.create({
      data: { name, description },
    });
    res.status(201).json(brand);
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateBrand = async (req: Request, res: Response) => {
  try {
    const { name, description } = req.body;
    const brand = await prisma.brand.update({
      where: { id: Number(req.params.id) },
      data: { name, description },
    });
    res.json(brand);
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteBrand = async (req: Request, res: Response) => {
  try {
    await prisma.brand.delete({
      where: { id: Number(req.params.id) },
    });
    res.json({ success: true, message: 'Brand removed' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
