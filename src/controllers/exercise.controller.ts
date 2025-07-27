import { Request, Response } from "express";
import { createExercise, deleteExercise, getFinalExam, updateExercise } from "../services/exercise.service";
import { createExerciseSchema, updateExerciseSchema } from "../schemas/exercise.schema";
import { Prisma } from "@prisma/client";

export const getFinal = async (req: Request, res: Response) => {
    try {
        const finalExam = await getFinalExam();
        if (!finalExam) return res.status(404).json({ message: "Final exam tidak ditemukan" });
        res.status(200).json({ message: "Final exam berhasil dikirimkan", data: finalExam });
    } catch (error: any) {
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
}

export const create = async (req: Request, res: Response) => {
    const validationResult = createExerciseSchema.safeParse(req.body);
    if (!validationResult.success) {
        return res.status(400).json({ message: 'Validasi gagal', errors: validationResult.error.flatten().fieldErrors });
    }

    try {
        const newExercise = await createExercise(validationResult.data);
        res.status(201).json({ message: 'Latihan berhasil dibuat', data: newExercise });
    } catch (error: any) {
        res.status(500).json({ message: 'Gagal membuat latihan.', error: error.message });
    }
};

export const update = async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    const validationResult = updateExerciseSchema.safeParse(req.body);
    if (!validationResult.success) {
        return res.status(400).json({ message: 'Validasi gagal', errors: validationResult.error.flatten().fieldErrors });
    }

    try {
        const updatedExercise = await updateExercise(id, validationResult.data);
        res.status(200).json({ message: 'Latihan berhasil diperbarui', data: updatedExercise });
    } catch (error: any) {
        if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
            return res.status(404).json({ message: 'Gagal memperbarui. Latihan tidak ditemukan.' });
        }
        res.status(500).json({ message: 'Gagal memperbarui latihan.', error: error.message });
    }
};

export const remove = async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    try {
        await deleteExercise(id);
        res.status(200).json({ message: 'Latihan berhasil dihapus.' });
    } catch (error: any) {
        if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
            return res.status(404).json({ message: 'Gagal menghapus. Latihan tidak ditemukan.' });
        }
        res.status(500).json({ message: 'Gagal menghapus latihan.', error: error.message });
    }
};
