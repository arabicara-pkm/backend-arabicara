import { PrismaClient } from '@prisma/client';
import { z } from 'zod';
import { createLevelSchema } from '../schemas/level.schema';

const prisma = new PrismaClient();

// Mendapatkan semua level, diurutkan berdasarkan sequence
export const getAllLevels = async () => {
    return await prisma.level.findMany({
        orderBy: {
            sequence: 'asc',
        },
    });
};

export const getLevelById = async (id: number, includeQuery?: string) => {
    const includeOptions: any = {};
    const includes = includeQuery?.split(',') || [];

    // Jika query meminta 'lessons'
    if (includes.includes('lessons')) {
        includeOptions.lessons = {
            orderBy: { sequence: 'asc' },
        };
    }

    // Jika query meminta 'exercises'
    if (includes.includes('exercises')) {
        includeOptions.exercises = {
            include: {
                choices: true,
            },
        };
    }

    return await prisma.level.findUnique({
        where: { id },
        include: includeOptions, // Gunakan objek include yang dinamis
    });
};


// Membuat level baru
export const createLevel = async (data: z.infer<typeof createLevelSchema>) => {
    return await prisma.level.create({ data });
};

// Mengupdate level berdasarkan ID
export const updateLevel = async (id: number, data: z.infer<typeof createLevelSchema>) => {
    return await prisma.level.update({
        where: { id },
        data,
    });
};

export const deleteLevel = async (id: number) => {
    return await prisma.$transaction(async (tx) => {
        // await tx.userLessonProgress.deleteMany({
        //     where: { lesson: { levelId: id } },
        // });

        await tx.lesson.deleteMany({
            where: { levelId: id },
        });

        await tx.answerChoice.deleteMany({
            where: { exercise: { levelId: id } },
        });

        await tx.exercise.deleteMany({
            where: { levelId: id },
        });

        const deletedLevel = await tx.level.delete({
            where: { id },
        });

        return deletedLevel;
    });
};
