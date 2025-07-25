import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

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
export const isAdmin = (req: Request, res: Response, next: NextFunction) => {
    if (req.user && req.user.role === 'admin') {
        next(); // Lanjutkan jika user adalah admin
    } else {
        return res.status(403).json({ message: 'Akses ditolak. Membutuhkan hak akses admin.' });
    }
};