import { createExerciseSchema, updateExerciseSchema } from "../schemas/exercise.schema";
import { PrismaClient } from "@prisma/client";
import z from "zod";

const prisma = new PrismaClient();

type ExerciseData = z.infer<typeof createExerciseSchema>;
type UpdateExerciseData = z.infer<typeof updateExerciseSchema>;

export const getFinalExam = async () => {
    return await prisma.exercise.findMany({
        where: { levelId: null },
        include: { choices: true }
    });
}

export const createExercise = async (data: ExerciseData) => {
    const { choices, ...exerciseData } = data;

    return await prisma.$transaction(async (tx) => {
        // 1. Buat exercise utama
        const exercise = await tx.exercise.create({
            data: exerciseData,
        });

        // 2. Siapkan data pilihan jawaban dengan ID exercise yang baru
        const choicesData = choices.map(choice => ({
            ...choice,
            exerciseId: exercise.id,
        }));

        // 3. Buat semua pilihan jawaban
        await tx.answerChoice.createMany({
            data: choicesData,
        });

        // Kembalikan exercise beserta pilihan jawabannya
        return { ...exercise, choices };
    })
}

export const updateExercise = async (id: number, data: UpdateExerciseData) => {
    const { choices, ...exerciseData } = data;

    return await prisma.$transaction(async (tx) => {
        // 1. Update data exercise utama
        const updatedExercise = await tx.exercise.update({
            where: { id },
            data: exerciseData,
        });

        // 2. Jika ada data 'choices' baru, hapus yang lama dan buat yang baru
        if (choices && choices.length > 0) {
            // Hapus semua pilihan jawaban yang lama
            await tx.answerChoice.deleteMany({
                where: { exerciseId: id },
            });

            // Siapkan data pilihan jawaban baru
            const newChoicesData = choices.map(choice => ({
                ...choice,
                exerciseId: id,
            }));

            // Buat semua pilihan jawaban yang baru
            await tx.answerChoice.createMany({
                data: newChoicesData
            });
        }

        // Ambil data terbaru untuk dikembalikan
        return await tx.exercise.findUnique({
            where: { id },
            include: { choices: true },
        });
    });
}

export const deleteExercise = async (id: number) => {
    return await prisma.$transaction(async (tx) => {
        // Hapus pilihan jawaban terlebih dahulu untuk menghindari error constraint
        await tx.answerChoice.deleteMany({
            where: { exerciseId: id },
        });

        // Hapus exercise utama
        return await tx.exercise.delete({
            where: { id },
        });
    });
};