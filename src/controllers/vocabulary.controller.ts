// src/controllers/vocabulary.controller.ts
import { Request, Response } from "express";
import * as VocabularyService from "../services/vocabulary.service";
import { createVocabularySchema, updateVocabularySchema } from "../schemas/vocabulary.schema";

export const getAllVocabulariesHandler = async (req: Request, res: Response) => {
  try {
    const vocabularies = await VocabularyService.getAllVocabularies();
    res.status(200).json(vocabularies);
  } catch (error) {
    res.status(500).json({ message: "Gagal mengambil data vocabulary." });
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
  } catch (error) {
    res.status(500).json({ message: "Gagal mengambil detail vocabulary." });
  }
};

export const createVocabularyHandler = async (req: Request, res: Response) => {
  const validationResult = createVocabularySchema.safeParse(req.body);

  if (!validationResult.success) {
    return res.status(400).json({
      success: false,
      message: 'Validasi gagal.',
      errors: validationResult.error.flatten().fieldErrors,
    });
  }

  try {
    const newVocabulary = await VocabularyService.createVocabulary(validationResult.data.body);
    res.status(201).json({ message: 'Kosakata berhasil dibuat', data: newVocabulary });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};


export const updateVocabularyHandler = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const validationResult = updateVocabularySchema.safeParse(req.body);
    if (!validationResult.success) {
      return res.status(400).json({ message: 'Validasi gagal', errors: validationResult.error.flatten().fieldErrors });
    }
    const updatedVocabulary = await VocabularyService.updateVocabulary(id, req.body);
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
    await VocabularyService.deleteVocabulary(id);
    res.status(200).json({ message: "Vocabulary berhasil dihapus." });
  } catch (error) {
    res.status(500).json({ message: "Gagal menghapus vocabulary." });
  }
};
