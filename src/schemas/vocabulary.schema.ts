import { z } from 'zod';

export const createVocabularySchema = z.object({
  arabicText: z.string().min(1, 'Teks Arab wajib diisi'),
  indonesianText: z.string().min(1, "Text indonesia tidak boleh kosong."),
  categoryId: z.number().min(1, { message: 'Kategori wajib diisi' }),
  arabicVoicePath: z.string().optional(),
  indonesianVoicePath: z.string().optional(),
});

export const updateVocabularySchema = z.object({
  params: z.object({
    id: z.string().min(1, 'ID diperlukan'),
  }),
  body: z.object({
    arabicText: z.string().optional(),
    indonesianText: z.string().optional(),
    categoryId: z.number().optional(),
    arabicVoicePath: z.string().optional(),
    indonesianVoicePath: z.string().optional(),
  }),
});

export const getVocabularySchema = z.object({
  params: z.object({
    id: z.string().min(1, 'ID diperlukan'),
  }),
});

export const deleteVocabularySchema = z.object({
  params: z.object({
    id: z.string().min(1, 'ID diperlukan'),
  }),
});
