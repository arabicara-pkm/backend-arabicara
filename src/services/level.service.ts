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

// Mendapatkan satu level berdasarkan ID
export const getLevelById = async (id: number, include?: string) => {
    return await prisma.level.findUnique({
        where: { id },
        // Gunakan 'include' dari Prisma berdasarkan query parameter
        include: {
            lessons: include === 'lessons' ? true : false,
        },
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

// Menghapus level berdasarkan ID
export const deleteLevel = async (id: number) => {
    return await prisma.level.delete({
        where: { id },
    });
};