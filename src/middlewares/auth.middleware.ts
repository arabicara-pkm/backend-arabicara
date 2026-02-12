import { Request, Response, NextFunction } from 'express';
import { createClient } from '@supabase/supabase-js';
import { PrismaClient } from '@prisma/client'; // <-- Tambahkan impor ini

const prisma = new PrismaClient();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    throw new Error("SUPABASE_URL dan SUPABASE_ANON_KEY harus ada di .env");
}

const supabase = createClient(supabaseUrl, supabaseKey);

export const verifyToken = async (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Akses ditolak. Token tidak disediakan.' });
    }

    try {
        // CARA BARU: Biarkan Supabase yang memverifikasi tokennya
        const { data: { user }, error } = await supabase.auth.getUser(token);

        if (error || !user) {
            console.error("Supabase Auth Error:", error?.message);
            return res.status(403).json({ message: 'Token tidak valid atau kadaluwarsa.' });
        }

        // Jika berhasil, user object dari Supabase sudah tersedia
        // Kita simpan data penting ke req.user untuk dipakai middleware selanjutnya
        req.user = {
            userId: user.id,
            email: user.email || '',
            role: user.role || ''
        };

        next();

    } catch (error: any) {
        console.error("Internal Auth Error:", error.message);
        return res.status(500).json({ message: 'Terjadi kesalahan server saat verifikasi.' });
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
        return res.status(500).json({ message: error.message });
    }
};