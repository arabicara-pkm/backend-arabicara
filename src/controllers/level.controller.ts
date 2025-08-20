import { Request, Response } from 'express';
import * as LevelService from '../services/level.service';
import { createLevelSchema, updateLevelSchema } from '../schemas/level.schema';
import { Prisma } from '@prisma/client';

export const getAll = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.userId;

        if (!userId) {
            return res.status(401).json({ message: "Unauthorized: User ID not found in token." });
        }

        const levels = await LevelService.getAllLevels(userId);
        res.status(200).json({ message: 'Levels berhasil dikirimkan', data: levels });
    } catch (error: any) {
        res.status(500).json({ message: 'Gagal mengambil data level.', error: error.message });
    }
};

export const getById = async (req: Request, res: Response) => {
    try {
        const id = parseInt(req.params.id);
        const userId = req.user?.userId;
        const { include } = req.query as { include?: string };

        if (!userId) {
            return res.status(401).json({ message: "Unauthorized: User ID not found in token." });
        }

        const level = await LevelService.getLevelById(id, userId, include);

        if (!level) {
            return res.status(404).json({ message: 'Level tidak ditemukan.' });
        }
        res.status(200).json({ message: 'Level berhasil ditemukan', data: level });
    } catch (error: any) {
        res.status(500).json({ message: 'Gagal mengambil data level.', error: error.message });
    }
};

export const create = async (req: Request, res: Response) => {
    const validationResult = createLevelSchema.safeParse(req.body);
    if (!validationResult.success) {
        return res.status(400).json({ message: 'Validasi gagal', errors: validationResult.error.flatten().fieldErrors });
    }

    try {
        const newLevel = await LevelService.createLevel(validationResult.data);
        res.status(201).json({ message: 'Level berhasil dibuat', data: newLevel });
    } catch (error: any) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            if (error.code === 'P2002') {
                if (Array.isArray(error.meta?.target) && error.meta.target.includes('sequence')) {
                    return res.status(409).json({
                        success: false,
                        message: 'Nomor urutan sudah digunakan. Silakan gunakan nomor lain.'
                    });
                }
            }
        }
        res.status(500).json({ success: false, message: 'Terjadi kesalahan pada server saat membuat level.' });
    }
};


export const update = async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    const validationResult = updateLevelSchema.safeParse(req.body);
    if (!validationResult.success) {
        return res.status(400).json({ message: 'Validasi gagal', errors: validationResult.error.flatten().fieldErrors });
    }

    try {
        const { name, sequence, description } = validationResult.data;
        if (typeof name !== 'string' || typeof sequence !== 'number') {
            return res.status(400).json({ message: 'Validasi gagal', errors: { name: name === undefined ? ['Name is required'] : [], sequence: sequence === undefined ? ['Sequence is required'] : [] } });
        }
        const updatedLevel = await LevelService.updateLevel(id, { name, sequence, description });
        res.status(200).json({ message: 'Level berhasil diperbarui', data: updatedLevel });
    } catch (error: any) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            if (error.code === 'P2002') {
                if (Array.isArray(error.meta?.target) && error.meta.target.includes('sequence')) {
                    return res.status(409).json({
                        success: false,
                        message: 'Gagal memperbarui. Nomor urutan sudah digunakan oleh level lain.'
                    });
                }
            }
            if (error.code === 'P2025') {
                return res.status(404).json({
                    success: false,
                    message: 'Gagal memperbarui. Level tidak ditemukan.'
                });
            }
        }

        res.status(500).json({ success: false, message: 'Terjadi kesalahan pada server saat memperbarui level.' });
    }
};

export const remove = async (req: Request, res: Response) => {
    try {
        const id = parseInt(req.params.id);
        await LevelService.deleteLevel(id);
        res.status(200).json({ message: 'Level berhasil dihapus.' });
    } catch (error: any) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            if (error.code === 'P2025') {
                return res.status(404).json({
                    success: false,
                    message: 'Gagal menghapus. Level tidak ditemukan.'
                });
            }
        }
        res.status(500).json({ message: 'Gagal menghapus level.', error: error.message });
    }
};