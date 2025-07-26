import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client'; // <-- Tambahkan impor ini

const prisma = new PrismaClient();

const SUPABASE_JWT_SECRET = process.env.SUPABASE_JWT_SECRET;

if (!SUPABASE_JWT_SECRET) {
    throw new Error("SUPABASE_JWT_SECRET tidak ditemukan di file .env");
}

export const verifyToken = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1]

    if (!token) {
        return res.status(401).json({ message: 'Akses ditolak. Token tidak disediakan.' });
    }

    try {
        const decoded = jwt.verify(token, SUPABASE_JWT_SECRET);
        const userId = (decoded as any).sub;

        req.user = {
            userId: userId,
            email: (decoded as any).email,
            role: (decoded as any).role
        };

        next();
    } catch (error) {
        return res.status(403).json({ message: 'Token tidak valid atau sudah kedaluwarsa.' });
    }
};

// Middleware untuk memeriksa apakah user adalah admin
export const isAdmin = async (req: Request, res: Response, next: NextFunction) => {
    // Pastikan middleware verifyToken sudah berjalan dan req.user ada
    if (!req.user || !req.user.userId) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    try {
        const userId = req.user.userId;

        // 1. Cari profil pengguna di tabel publik berdasarkan ID dari token
        const userProfile = await prisma.user.findUnique({
            where: {
                id: userId,
            },
        });

        // 2. Cek apakah profil ditemukan dan apakah perannya adalah 'admin'
        if (userProfile && userProfile.role === 'admin') {
            next(); // Lanjutkan jika pengguna adalah admin
        } else {
            // Jika tidak, tolak akses
            return res.status(403).json({ message: 'Akses ditolak. Membutuhkan hak akses admin.' });
        }
    } catch (error: any) {
        return res.status(500).json({ message: error.message});
    }
};