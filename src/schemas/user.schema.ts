import { z } from 'zod';

// Skema untuk registrasi user baru
export const registerSchema = z.object({
    username: z.string()
        .nonempty("Username tidak boleh kosong.")
        .min(3, "Username minimal harus 3 karakter."),

    email: z.email("Format email tidak valid.")
        .nonempty("Email tidak boleh kosong."),

    password: z.string()
        .nonempty("Password tidak boleh kosong.")
        .min(6, "Password minimal harus 6 karakter."),
});

// Skema untuk login
export const loginSchema = z.object({
    email: z.email("Format email tidak valid."),
    password: z.string().min(1, "Password tidak boleh kosong."),
});

// Skema untuk update user
export const updateUserSchema = z.object({
    username: z.string().min(3, "Username minimal harus 3 karakter.").optional(),
    avatar: z.url("URL avatar tidak valid.").optional(),
}).partial(); // .partial() membuat semua field di dalamnya menjadi opsional