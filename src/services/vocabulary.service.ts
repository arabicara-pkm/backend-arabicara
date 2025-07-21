// src/services/vocabulary.service.ts
import { prisma } from "../lib/prisma";

export const getAllVocabularies = async () => {
  return prisma.vocabulary.findMany({
    include: {
      category: true,
    },
  });
};

export const getVocabularyById = async (id: string) => {
  return prisma.vocabulary.findUnique({
    where: { id: Number(id) },
    include: {
      category: true,
    },
  });
};

export const createVocabulary = async (data: {
  arabicText: string;
  indonesianText: string;
  categoryId: number;
  arabicVoicePath?: string;
  indonesianVoicePath?: string;
}) => {
  return prisma.vocabulary.create({
    data,
  });
};

export const updateVocabulary = async (
  id: string,
  data: Partial<{
    arabicText: string;
    indonesianText: string;
    categoryId: number;
    arabicVoicePath?: string;
    indonesianVoicePath?: string;
  }>
) => {
  return prisma.vocabulary.update({
    where: { id: Number(id) },
    data,
  });
};

export const deleteVocabulary = async (id: string) => {
  return prisma.vocabulary.delete({
    where: { id: Number(id) },
  });
};
