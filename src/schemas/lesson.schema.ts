import { z } from 'zod';

export const createLessonSchema = z.object({
  title: z.string().min(1, 'Judul pelajaran wajib diisi'),
  content: z.string().min(1, 'Konten pelajaran wajib diisi'),
  sequence: z.number().int('Nomor urutan harus berupa bilangan bulat.').min(1, 'Nomor urutan harus angka positif.'),
  levelId: z.number().int('ID level harus berupa bilangan bulat.').min(1, 'ID level wajib diisi'),
  voicePath: z.string().optional(),
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
