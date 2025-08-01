import { z } from 'zod';

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: ID unik pengguna.
 *           example: 1
 *         email:
 *           type: string
 *           format: email
 *           description: Alamat email pengguna.
 *           example: user@example.com
 *         username:
 *           type: string
 *           description: Nama pengguna.
 *           example: user123
 *         role:
 *           type: string
 *           description: Peran pengguna (student/admin).
 *           example: student
 *
 *     UserInput:
 *       type: object
 *       required:
 *         - email
 *         - username
 *         - password
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           example: user@example.com
 *         username:
 *           type: string
 *           example: user123
 *         password:
 *           type: string
 *           format: password
 *           example: password123
 *
 *     UserUpdateInput:
 *       type: object
 *       properties:
 *         username:
 *           type: string
 *           description: Nama baru untuk pengguna.
 *           example: user_updated
 *         avatar:
 *           type: string
 *           format: url
 *           description: URL baru untuk avatar pengguna.
 *           example: https://example.com/avatar.png
 */


// Skema untuk registrasi user baru
export const registerSchema = z.object({
    username: z.string()
        .min(1, "Username tidak boleh kosong.")
        .min(3, "Username minimal harus 3 karakter."),

    email: z.string().email().min(1, "Email tidak boleh kosong."),

    password: z.string()
        .min(1, "Password tidak boleh kosong.")
        .min(6, "Password minimal harus 6 karakter."),
});

// Skema untuk login
export const loginSchema = z.object({
    email: z.string().email("Email tidak valid.").min(1, "Email tidak boleh kosong."),
    password: z.string().min(1, "Password tidak boleh kosong."),
});

// Skema untuk update user
export const updateUserSchema = z.object({
    username: z.string().min(3, "Username minimal harus 3 karakter.").optional(),
    avatar: z.string().url("URL avatar tidak valid.").optional(),
}).partial(); // .partial() membuat semua field di dalamnya menjadi opsional