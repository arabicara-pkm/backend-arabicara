import { prisma } from "../lib/prisma";

export const getAllLessons = async () => {
  return prisma.lesson.findMany({
    include: {
      level: true,
    },
    orderBy: {
      sequence: "asc",
    },
  });
};

export const getLessonById = async (id: string) => {
  return prisma.lesson.findUnique({
    where: { id: Number(id) },
    include: {
      level: true,
    },
  });
};

export const createLesson = async (data: {
  title: string;
  content: string;
  voicePath?: string;
  sequence: number;
  levelId: number;
}) => {
  return prisma.lesson.create({
    data,
  });
};

export const updateLesson = async (
  id: string,
  data: Partial<{
    title: string;
    content: string;
    voicePath?: string;
    sequence: number;
    levelId: number;
  }>
) => {
  return prisma.lesson.update({
    where: { id: Number(id) },
    data,
  });
};

export const deleteLesson = async (id: string) => {
  return prisma.lesson.delete({
    where: { id: Number(id) },
  });
};

export const getLessonsByLevelId = async (levelId: string) => {
  return prisma.lesson.findMany({
    where: {
      levelId: Number(levelId),
    },
    orderBy: {
      sequence: "asc",
    },
  });
};