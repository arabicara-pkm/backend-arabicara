import { z } from "zod";

export const createCategorySchema = z.object({
  body: z.object({
    name: z.string().min(1, "Nama kategori wajib diisi"),
  }),
});

export const updateCategorySchema = z.object({
  params: z.object({
    id: z.string(),
  }),
  body: z.object({
    name: z.string().min(1, "Nama kategori wajib diisi"),
  }),
});

export const getOrDeleteCategorySchema = z.object({
  params: z.object({
    id: z.string(),
  }),
});
