import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const createCategory = async (req: Request, res: Response) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res.status(400).json({ message: "Nama kategori wajib diisi." });
    }
    const category = await prisma.dictionaryCategory.create({
      data: { name },
    });
    res.status(201).json(category);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllCategories = async (req: Request, res: Response) => {
  try {
    const categories = await prisma.dictionaryCategory.findMany();
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: "Gagal mengambil kategori.", error });
  }
};