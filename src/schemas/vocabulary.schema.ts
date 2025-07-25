import { z } from 'zod';

export const createVocabularySchema = z.object({
  body: z.object({
    arabicText: z.string().min(1, 'Teks Arab wajib diisi'),
    indonesianText: z.string().nonempty("Text indon tidak boleh kosong."),
    categoryId: z.number().refine(val => typeof val === 'number', {
  message: 'Kategori wajib diisi',
}),
    arabicVoicePath: z.string().optional(),
    indonesianVoicePath: z.string().optional(),
  }),
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
