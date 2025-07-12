import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { DecodedUser } from '../types/user.type';

const JWT_SECRET = process.env.JWT_SECRET || 'your-default-secret';

// Middleware untuk memverifikasi token
export const verifyToken = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
        return res.status(401).json({ message: 'Akses ditolak. Token tidak disediakan.' });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded as DecodedUser; // Simpan data user dari token ke request
        next();
    } catch (error) {
        return res.status(403).json({ message: 'Token tidak valid.' });
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