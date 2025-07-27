import { z } from 'zod';

export const createLessonSchema = z.object({
  title: z.string().nonempty('Judul pelajaran wajib diisi'),
  content: z.string().nonempty('Konten pelajaran wajib diisi'),
  sequence: z.number().int('Nomor urutan harus berupa bilangan bulat.').min(1, 'Nomor urutan harus angka positif.'),
  level_id: z.number().int('ID level harus berupa bilangan bulat.').min(1, 'ID level wajib diisi'),
  voice_path: z.string().optional(),
});

export const updateLessonSchema = createLessonSchema.partial();

export const getLessonByIdSchema = z.object({
  params: z.object({
    lessonId: z.string(),
  }),
});

export const deleteLessonSchema = z.object({
  params: z.object({
    lessonId: z.string(),
  }),
});
