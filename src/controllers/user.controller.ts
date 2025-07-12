import { Request, Response } from 'express';
import * as UserService from '../services/user.service';
import { updateUserSchema } from '../schemas/user.schema';

export const updateCurrentUser = async (req: Request, res: Response) => {
    const userId = req.user?.userId;
    if (!userId) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    const validationResult = updateUserSchema.safeParse(req.body);
    if (!validationResult.success) {
        return res.status(400).json({
            success: false,
            message: 'Validasi gagal.',
            errors: validationResult.error.flatten().fieldErrors,
        });
    }

    try {
        const updatedUser = await UserService.updateUserById(userId, validationResult.data);
        res.status(200).json({ message: 'Profil berhasil diperbarui', data: updatedUser });
    } catch (error) {
        res.status(500).json({ message: 'Terjadi kesalahan pada server' });
    }
};

export const deleteCurrentUser = async (req: Request, res: Response) => {
    const userId = req.user?.userId;
    if (!userId) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    try {
        await UserService.deleteUserById(userId);
        res.status(200).json({ message: 'Akun berhasil dihapus.' });
    } catch (error) {
        res.status(500).json({ message: 'Terjadi kesalahan pada server' });
    }
};