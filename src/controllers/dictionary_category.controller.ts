import { NextFunction, Request, Response } from "express";
import * as CategoryService from "../services/dictionary_category.service";


export const createCategoryHandler = async (req: Request, res: Response) => {
  try {
    const { name } = req.body;
    const category = await CategoryService.createCategory(name);
    res.status(201).json({ message: "Kategori berhasil dibuat", data: category });
  } catch (error) {
    res.status(500).json({ message: "Gagal membuat kategori", error });
  }
};

export const getAllCategoriesHandler = async (_req: Request, res: Response) => {
  try {
    const categories = await CategoryService.getAllCategories();
    res.json({ data: categories });
  } catch (error) {
    res.status(500).json({ message: "Gagal mengambil data", error });
  }
};

export const getCategoryHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = parseInt(req.params.id);
    const category = await CategoryService.getCategoryById(id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "ID harus berupa angka" });
    }
    if (!category) {
      return res.status(404).json({ message: "Kategori tidak ditemukan" });
    }
    res.json({ data: category });
  } catch (error) {
    res.status(500).json({ message: "Gagal mengambil data", error });
  }
};

export const updateCategoryHandler = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const { name } = req.body;
    const category = await CategoryService.updateCategory(id, name);

    res.json({ message: "Kategori berhasil diperbarui", data: category });
  } catch (error) {
    res.status(500).json({ message: "Gagal memperbarui kategori", error });
  }
};

export const deleteCategoryHandler = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    await CategoryService.deleteCategory(id);

    res.json({ message: "Kategori berhasil dihapus" });
  } catch (error) {
    res.status(500).json({ message: "Gagal menghapus kategori", error });
  }
};

