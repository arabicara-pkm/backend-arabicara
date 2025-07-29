// src/controllers/vocabulary.controller.ts
import { Request, Response } from "express";
import * as VocabularyService from "../services/vocabulary.service";
import { createVocabularySchema, updateVocabularySchema } from "../schemas/vocabulary.schema";
import { Prisma } from '@prisma/client';

export const getAllVocabulariesHandler = async (req: Request, res: Response) => {
  try {
    const vocabularies = await VocabularyService.getAllVocabularies();
    res.status(200).json(vocabularies);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getVocabularyHandler = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const vocabulary = await VocabularyService.getVocabularyById(id);
    if (!vocabulary) {
      return res.status(404).json({ message: "Vocabulary tidak ditemukan." });
    }
    res.status(200).json(vocabulary);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const createVocabularyHandler = async (req: Request, res: Response) => {
  const validationResult = createVocabularySchema.safeParse(req.body);

  if (!validationResult.success) {
    return res.status(400).json({
      status: "fail",
      message: "Validasi gagal.",
      errors: validationResult.error.flatten().fieldErrors,
    });
  }

  try {
    const newVocabulary = await VocabularyService.createVocabulary(validationResult.data);
    return res.status(201).json({
      status: "success",
      message: "Kosakata berhasil dibuat.",
      data: newVocabulary,
    });
  } catch (error: any) {
    console.error("Error creating vocabulary:", error);

    // Tangani foreign key constraint error
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === 'P2003'
    ) {
      return res.status(400).json({
        status: "fail",
        message: "Kategori tidak ditemukan atau tidak valid.",
      });
    }

    return res.status(500).json({
      status: "error",
      message: error.message || "Terjadi kesalahan di server.",
    });
  }
}

export const updateVocabularyHandler = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const validationResult = updateVocabularySchema.safeParse({
      params: req.params,
      body: req.body
    });

    if (!validationResult.success) {
      return res.status(400).json({ message: 'Validasi gagal', errors: validationResult.error.flatten().fieldErrors });
    }
    const idnumber = parseInt(id, 10);
    const updatedVocabulary = await VocabularyService.updateVocabulary(
  parseInt(req.params.id),
  req.body,
);

    res.status(200).json(updatedVocabulary);
  } catch (error: any) {
    if (error.code === 'P2003') {
      return res.status(404).json({
        success: false,
        message: 'Gagal memperbarui. Category tidak ditemukan.'
      });
    }
    res.status(500).json({ message: error.message });
  }
};

export const deleteVocabularyHandler = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const idnumber = parseInt(id, 10);
    await VocabularyService.deleteVocabulary(idnumber);
    res.status(200).json({ message: "Vocabulary berhasil dihapus." });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

