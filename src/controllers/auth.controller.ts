import { Request, Response } from 'express';
import * as AuthService from '../services/auth.service';
import { registerSchema, loginSchema } from '../schemas/user.schema';

export const register = async (req: Request, res: Response) => {
    const validationResult = registerSchema.safeParse(req.body);

    if (!validationResult.success) {
        return res.status(400).json({
            success: false,
            message: 'Validasi gagal.',
            errors: validationResult.error.flatten().fieldErrors,
        });
    }

    try {
        const user = await AuthService.registerUser(validationResult.data);
        res.status(201).json({ message: 'Registrasi berhasil', data: user });
    } catch (error: any) {
        res.status(400).json({ success: false, message: error.message });
    }
};

export const login = async (req: Request, res: Response) => {
    const validationResult = loginSchema.safeParse(req.body);

    if (!validationResult.success) {
        return res.status(400).json({
            success: false,
            message: 'Validasi gagal.',
            errors: validationResult.error.flatten().fieldErrors,
        });
    }

    try {
        const result = await AuthService.loginUser(validationResult.data);
        res.status(200).json({ message: 'Login berhasil', data: result });
    } catch (error: any) {
        res.status(401).json({ success: false, message: error.message });
    }
};

export const getMe = async (req: Request, res: Response) => {
    res.status(200).json({ message: 'Profil berhasil didapat', data: req.user });
};