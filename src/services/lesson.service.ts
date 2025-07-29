import z from "zod";
import { prisma } from "../lib/prisma";
import { createLessonSchema, updateLessonSchema } from "@/schemas/lesson.schema";
import { deleteAudio, textToSpeech, uploadAudioStream } from "../utils/media.helper";

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

export const getLessonById = async (id: string) => {
  return prisma.lesson.findUnique({
    where: { id: Number(id) },
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
      ...lessonData, // title, content, sequence
      voicePath,
      level: {
        connect: {
          id: levelId, // Hubungkan ke level yang ada
        },
      },
    },
  });
};

export const updateLesson = async (id: number, data: z.infer<typeof updateLessonSchema>) => {
  const { levelId, ...lessonData } = data;

  const existingLesson = await prisma.lesson.findUnique({ where: { id } });
  if (!existingLesson) {
    throw new Error('Lesson tidak ditemukan'); // Akan ditangani sebagai 404 di controller
  }

  let newVoicePath = existingLesson.voicePath;

  if (lessonData.content && lessonData.content !== existingLesson.content) {
    if (existingLesson.voicePath) {
      await deleteAudio(existingLesson.voicePath);
    }
    const audioBuffer = await textToSpeech(lessonData.content, AUDIO_LANGUAGE);
    newVoicePath = await uploadAudioStream(audioBuffer);
  }

  // Update data di database
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
  const lessonToDelete = await prisma.lesson.findUnique({ where: { id } });

  if (lessonToDelete?.voicePath) {
    await deleteAudio(lessonToDelete.voicePath);
  }

  return await prisma.lesson.delete({ where: { id } });
};