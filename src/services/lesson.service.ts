import { PrismaClient } from "@prisma/client";
import z from "zod";
import { createLessonSchema, updateLessonSchema } from "../schemas/lesson.schema";
import { deleteAudio, textToSpeech, uploadAudioStream } from "../utils/media.helper";

const prisma = new PrismaClient();

const AUDIO_LANGUAGE = 'ar-XA';

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

export const getLessonById = async (id: number) => {
  return prisma.lesson.findUnique({
    where: { id },
    include: {
      level: true,
    },
  });
};

export const createLesson = async (data: z.infer<typeof createLessonSchema>) => {
  const { levelId, ...lessonData } = data;

  const audioBuffer = await textToSpeech(lessonData.content, AUDIO_LANGUAGE);
  const voicePath = await uploadAudioStream(audioBuffer);

  return await prisma.lesson.create({
    data: {
      ...lessonData,
      voicePath,
      level: {
        connect: {
          id: levelId,
        },
      },
    },
  });
};

export const updateLesson = async (id: number, data: z.infer<typeof updateLessonSchema>) => {
  const { levelId, ...lessonData } = data;

  const existingLesson = await prisma.lesson.findUnique({ where: { id } });
  if (!existingLesson) {
    throw new Error('Lesson tidak ditemukan');
  }

  let newVoicePath = existingLesson.voicePath;

  if (lessonData.content && lessonData.content !== existingLesson.content) {
    if (existingLesson.voicePath) {
      await deleteAudio(existingLesson.voicePath);
    }
    const audioBuffer = await textToSpeech(lessonData.content, AUDIO_LANGUAGE);
    newVoicePath = await uploadAudioStream(audioBuffer);
  }

  return await prisma.lesson.update({
    where: { id },
    data: {
      ...lessonData,
      voicePath: newVoicePath,
      ...(levelId && {
        level: {
          connect: {
            id: levelId,
          },
        },
      }),
    },
  });
};

export const deleteLesson = async (id: number) => {
  return await prisma.$transaction(async (tx) => {
    const lessonToDelete = await tx.lesson.findUnique({
      where: { id },
    });

    if (!lessonToDelete) {
      throw new Error("Lesson tidak ditemukan");
    }

    const { sequence: deletedSequence, levelId: parentLevelId } = lessonToDelete;

    if (lessonToDelete.voicePath) {
      await deleteAudio(lessonToDelete.voicePath);
    }

    const deletedLesson = await tx.lesson.delete({
      where: { id },
    });

    await tx.lesson.updateMany({
      where: {
        levelId: parentLevelId,
        sequence: {
          gt: deletedSequence, // gt = greater than
        },
      },
      data: {
        sequence: {
          decrement: 1, // Kurangi sequence-nya dengan 1
        },
      },
    });

    return deletedLesson;
  });
};