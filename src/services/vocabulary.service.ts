import { prisma } from "../lib/prisma";
import { textToSpeech, uploadAudioStream, deleteAudio } from "../utils/media.helper";
import { z } from "zod";
import { createVocabularySchema, updateVocabularySchema } from "@/schemas/vocabulary.schema";

const ARABIC_LANG = 'ar-XA';
const INDONESIAN_LANG = 'id-ID';

export const getAllVocabularies = async () => {
  return prisma.vocabulary.findMany({
    include: {
      category: true,
    },
    orderBy: {
      id: 'asc',
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

export const createVocabulary = async (data: z.infer<typeof createVocabularySchema>) => {
  const { arabicText, indonesianText, categoryId } = data;

  // Proses TTS
  const [arabicAudio, indonesianAudio] = await Promise.all([
    textToSpeech(arabicText, ARABIC_LANG),
    textToSpeech(indonesianText, INDONESIAN_LANG),
  ]);

  // Upload audio
  const [arabicVoicePath, indonesianVoicePath] = await Promise.all([
    uploadAudioStream(arabicAudio),
    uploadAudioStream(indonesianAudio),
  ]);

  return await prisma.vocabulary.create({
    data: {
      arabicText,
      indonesianText,
      arabicVoicePath,
      indonesianVoicePath,
      categoryId,
    },
  });
};

type UpdateVocabularyInput = {
  arabicText?: string;
  indonesianText?: string;
  categoryId?: number;
};

export const updateVocabulary = async (
  id: number,
  data: UpdateVocabularyInput
) => {
  const existing = await prisma.vocabulary.findUnique({ where: { id } });
  if (!existing) throw new Error("Vocabulary tidak ditemukan");

  let arabicVoicePath = existing.arabicVoicePath;
  let indonesianVoicePath = existing.indonesianVoicePath;

  // Cek apakah perlu update audio Arabic
  if (data.arabicText && data.arabicText !== existing.arabicText) {
    if (arabicVoicePath) await deleteAudio(arabicVoicePath);
    const audio = await textToSpeech(data.arabicText, ARABIC_LANG);
    arabicVoicePath = await uploadAudioStream(audio);
  }

  // Cek apakah perlu update audio Indonesia
  if (data.indonesianText && data.indonesianText !== existing.indonesianText) {
    if (indonesianVoicePath) await deleteAudio(indonesianVoicePath);
    const audio = await textToSpeech(data.indonesianText, INDONESIAN_LANG);
    indonesianVoicePath = await uploadAudioStream(audio);
  }

  return await prisma.vocabulary.update({
    where: { id },
    data: {
      ...data,
      arabicVoicePath,
      indonesianVoicePath,
    },
  });
};

export const deleteVocabulary = async (id: number) => {
  const vocab = await prisma.vocabulary.findUnique({ where: { id } });
  if (!vocab) throw new Error("Vocabulary tidak ditemukan");

  // Hapus audio dari Cloudinary
  if (vocab.arabicVoicePath) await deleteAudio(vocab.arabicVoicePath);
  if (vocab.indonesianVoicePath) await deleteAudio(vocab.indonesianVoicePath);

  return await prisma.vocabulary.delete({
    where: { id },
  });
};

export const vocabularyByCategoryId = async (categoryId: string) => {
  return await prisma.vocabulary.findMany({
    where: {
      categoryId: Number(categoryId),
    },
  });
};
