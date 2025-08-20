import { PrismaClient } from "@prisma/client";
import z from "zod";
import { createLessonSchema, updateLessonSchema } from "../schemas/lesson.schema";
import { synthesizeLongAudio, deleteAudioFromGCS, createMultiLanguageAudio, uploadAudioStream, deleteAudio } from '../utils/media.helper';

const prisma = new PrismaClient();

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

  // 1. Buat audio multi-bahasa dari konten
  const audioBuffer = await createMultiLanguageAudio(lessonData.content);

  // 2. Unggah audio yang sudah digabung ke Cloudinary
  const voicePath = await uploadAudioStream(audioBuffer);

  // 3. Simpan lesson beserta link audionya
  return await prisma.lesson.create({
    data: {
      ...lessonData,
      voicePath,
      level: { connect: { id: levelId } },
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

  // Jika konten berubah, buat ulang audio
  if (lessonData.content && lessonData.content !== existingLesson.content) {
    // Hapus audio lama jika ada
    if (existingLesson.voicePath) {
      await deleteAudio(existingLesson.voicePath);
    }
    // Buat dan unggah audio baru
    const audioBuffer = await createMultiLanguageAudio(lessonData.content);
    newVoicePath = await uploadAudioStream(audioBuffer);
  }

  // Update data di database
  return await prisma.lesson.update({
    where: { id },
    data: {
      ...lessonData,
      voicePath: newVoicePath,
      ...(levelId && {
        level: { connect: { id: levelId } },
      }),
    },
  });
};


export const deleteLesson = async (id: number) => {
  return await prisma.$transaction(async (tx) => {
    // Temukan lesson yang akan dihapus untuk mendapatkan sequence dan levelId-nya
    const lessonToDelete = await tx.lesson.findUnique({
      where: { id },
    });

    if (!lessonToDelete) {
      throw new Error("Lesson tidak ditemukan");
    }

    const { sequence: deletedSequence, levelId: parentLevelId } = lessonToDelete;

    // Hapus file audio dari GCS jika ada
    if (lessonToDelete.voicePath) {
      const fileName = lessonToDelete.voicePath.split('/').pop();
      if (fileName) await deleteAudioFromGCS(fileName);
    }

    // Hapus record lesson dari database
    const deletedLesson = await tx.lesson.delete({
      where: { id },
    });

    // Perbarui sequence untuk semua lesson di level yang sama yang urutannya lebih besar
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