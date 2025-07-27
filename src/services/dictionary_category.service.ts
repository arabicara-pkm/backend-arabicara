import { prisma } from "../lib/prisma";

export const createCategory = async (name: string) => {
  return await prisma.dictionaryCategory.create({
    data: { name },
  });
};

export const getAllCategories = async () => {
  return await prisma.dictionaryCategory.findMany({
    orderBy: { createdAt: "desc" },
  });
};

export const getCategoryById = async (id: number) => {
  return await prisma.dictionaryCategory.findUnique({
    where: { id },
    include: {
      vocabularies: true,
    },
    
  });
};

export const updateCategory = async (id: number, name: string) => {
  return await prisma.dictionaryCategory.update({
    where: { id },
    data: { name },
  });
};

export const deleteCategory = async (id: number) => {
  return await prisma.dictionaryCategory.delete({
    where: { id },
  });
};