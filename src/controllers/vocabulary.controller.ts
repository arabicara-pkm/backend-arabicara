// src/controllers/vocabulary.controller.ts
import { Request, Response } from "express";
import * as VocabularyService from "../services/vocabulary.service";

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
  try {
    const newVocabulary = await VocabularyService.createVocabulary(req.body);
    res.status(201).json(newVocabulary);
  } catch (error) {
    res.status(500).json({ message: "Gagal menambahkan vocabulary." });
  }
};

export const updateVocabularyHandler = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updatedVocabulary = await VocabularyService.updateVocabulary(id, req.body);
    res.status(200).json(updatedVocabulary);
  } catch (error) {
    res.status(500).json({ message: "Gagal mengupdate vocabulary." });
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
