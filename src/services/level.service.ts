import { Lesson, PrismaClient, UserLessonProgress } from '@prisma/client';
import { z } from 'zod';
import { createLevelSchema, updateLevelSchema } from '../schemas/level.schema';

const prisma = new PrismaClient();

type LessonWithProgress = Lesson & {
    progress: UserLessonProgress[];
};

export const getAllLevels = async (userId: string) => {
    const levelsWithProgress = await prisma.level.findMany({
        orderBy: {
            sequence: 'asc',
        },
        include: {
            progress: {
                where: {
                    userId: userId,
                },
            },
        },
    });

    let previousLevelCompleted = true; // Anggap "Level 0" sudah selesai untuk membuka Level 1

    const transformedLevels = levelsWithProgress.map(level => {
        const { progress, ...levelData } = level; // Pisahkan array progress dari sisa data level
        let status = 'locked'; // Status default untuk setiap level

        if (progress.length > 0) {
            status = progress[0].status;
        } else if (previousLevelCompleted) {
            status = 'unlocked';
        }

        previousLevelCompleted = (progress.length > 0 && progress[0].status === 'completed');

        return {
            ...levelData, // Kembalikan semua data level (id, name, dll.)
            status: status, // Tambahkan field status yang sudah disederhanakan
        };
    });

    return transformedLevels;

};

export const getLevelById = async (id: number, userId: string, includeQuery?: string) => {
    const includeOptions: any = {};
    const includes = includeQuery?.split(',') || [];

    if (includes.includes('lessons')) {
        includeOptions.lessons = {
            orderBy: { sequence: 'asc' },
            include: {
                progress: {
                    where: {
                        userId: userId,
                    },
                },
            },
        };
    }

    if (includes.includes('exercises')) {
        includeOptions.exercises = {
            include: {
                choices: true,
            },
        };
    }

    const level = await prisma.level.findUnique({
        where: { id },
        include: includeOptions,
    });

    if (level && level.lessons) {
        let previousLessonCompleted = true;

        const lessonsWithProgress = level.lessons as LessonWithProgress[];

        const transformedLessons = lessonsWithProgress.map((lesson) => {
            const { progress, ...lessonData } = lesson;
            let status = 'locked';

            const isCompleted = progress.length > 0 && progress[0].status === 'completed';

            if (isCompleted) {
                status = 'completed';
            } else if (previousLessonCompleted) {
                status = 'unlocked';
            }

            previousLessonCompleted = isCompleted;

            return {
                ...lessonData,
                status,
            };
        });

        (level as any).lessons = transformedLessons;
    }

    return level;
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
        const levelToDelete = await tx.level.findUnique({
            where: { id },
        });

        if (!levelToDelete) {
            throw new Error("Level tidak ditemukan");
        }

        const deletedSequence = levelToDelete.sequence;

        const deletedLevel = await tx.level.delete({
            where: { id },
        });

        await tx.level.updateMany({
            where: {
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

        return deletedLevel;
    });
};