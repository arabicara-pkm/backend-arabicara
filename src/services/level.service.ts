import { PrismaClient } from '@prisma/client';
import { z } from 'zod';
import { createLevelSchema, updateLevelSchema } from '../schemas/level.schema';

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

    if (includes.includes('lessons')) {
        includeOptions.lessons = {
            orderBy: { sequence: 'asc' },
        };
    }

    if (includes.includes('exercises')) {
        includeOptions.exercises = {
            include: {
                choices: true,
            },
        };
    }

    return await prisma.level.findUnique({
        where: { id },
        include: includeOptions,
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