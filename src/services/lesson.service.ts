import { PrismaClient } from "@prisma/client";
import z from "zod";
import { createLessonSchema, updateLessonSchema } from "../schemas/lesson.schema";
import { synthesizeLongAudio, deleteAudioFromGCS } from '../utils/media.helper';

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

  // Buat lesson di DB dengan status PROCESSING
  const lesson = await prisma.lesson.create({
    data: {
      ...lessonData,
      audioStatus: 'PROCESSING',
      level: { connect: { id: levelId } },
    },
  });

  // Mulai proses pembuatan audio di latar belakang (fire-and-forget)
  const audioFileName = `lesson-${lesson.id}-audio`;
  synthesizeLongAudio(lesson.content, audioFileName)
    .then(async (operationId) => {
      // Simpan ID operasi untuk pelacakan status nanti
      await prisma.lesson.update({
        where: { id: lesson.id },
        data: { audioOperationId: operationId },
      });
      console.log(`ID Operasi ${operationId} disimpan untuk lesson ${lesson.id}`);
    })
    .catch(async (error) => {
      console.error("Gagal memulai sintesis audio:", error);
      // Jika gagal, update status di DB
      await prisma.lesson.update({
        where: { id: lesson.id },
        data: { audioStatus: 'FAILED' },
      });
    });

  // Langsung kembalikan data lesson tanpa menunggu audio selesai
  return lesson;
};

export const updateLesson = async (id: number, data: z.infer<typeof updateLessonSchema>) => {
  const { levelId, ...lessonData } = data;

  const existingLesson = await prisma.lesson.findUnique({ where: { id } });
  if (!existingLesson) {
    throw new Error('Lesson tidak ditemukan');
  }

  // Jika konten berubah, mulai ulang proses pembuatan audio
  if (lessonData.content && lessonData.content !== existingLesson.content) {
    console.log("Konten berubah, memulai ulang proses audio...");

    // Hapus file audio lama dari GCS jika ada
    if (existingLesson.voicePath) {
      const oldFileName = existingLesson.voicePath.split('/').pop();
      if (oldFileName) await deleteAudioFromGCS(oldFileName);
    }

    // Update lesson dengan konten baru dan reset status audio
    const updatedLesson = await prisma.lesson.update({
      where: { id },
      data: {
        ...lessonData,
        audioStatus: 'PROCESSING',
        voicePath: null, // Hapus path lama
        audioOperationId: null, // Hapus ID operasi lama
        ...(levelId && { level: { connect: { id: levelId } } }),
      },
    });

    // Mulai proses pembuatan audio baru di latar belakang
    const audioFileName = `lesson-${updatedLesson.id}-audio`;
    synthesizeLongAudio(updatedLesson.content, audioFileName)
      .then(async (operationId) => {
        await prisma.lesson.update({
          where: { id: updatedLesson.id },
          data: { audioOperationId: operationId },
        });
      })
      .catch(async (error) => {
        console.error("Gagal memulai sintesis audio baru:", error);
        await prisma.lesson.update({
          where: { id: updatedLesson.id },
          data: { audioStatus: 'FAILED' },
        });
      });

    return updatedLesson;
  } else {
    // Jika konten tidak berubah, lakukan update biasa
    return await prisma.lesson.update({
      where: { id },
      data: {
        ...lessonData,
        ...(levelId && { level: { connect: { id: levelId } } }),
      },
    });
  }
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