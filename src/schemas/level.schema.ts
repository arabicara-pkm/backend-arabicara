import { z } from 'zod';

/**
 * @swagger
 * components:
 *   schemas:
 *     # Definisi Model Utama
 *     Level:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: ID unik untuk level.
 *           example: 1
 *         name:
 *           type: string
 *           description: Nama dari level.
 *           example: "Level 1: Perkenalan"
 *         description:
 *           type: string
 *           description: Deskripsi singkat tentang level.
 *           example: "Mempelajari dasar-dasar sapaan."
 *         sequence:
 *           type: integer
 *           description: Nomor urutan untuk menampilkan level.
 *           example: 1
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Waktu level dibuat.
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Waktu level terakhir diperbarui.
 *
 *     # Skema baru untuk mendukung include
 *     Lesson:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 101
 *         levelId:
 *           type: integer
 *           example: 1
 *         title:
 *           type: string
 *           example: "Sapaan Pagi"
 *         content:
 *           type: string
 *           example: "Konten materi tentang sapaan pagi..."
 *         voicePath:
 *           type: string
 *           nullable: true
 *           example: "https://.../audio.mp3"
 *         sequence:
 *           type: integer
 *           example: 1
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *         status:
 *           type: string
 *           enum: ["locked", "unlocked", "completed"] 
 *
 *     LevelWithLessons:
 *       allOf:
 *         - $ref: '#/components/schemas/Level'
 *         - type: object
 *           properties:
 *             lessons:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Lesson'
 *
 *     # Skema Input dan Error
 *     LevelInput:
 *       type: object
 *       required:
 *         - name
 *         - sequence
 *       properties:
 *         name:
 *           type: string
 *           description: Nama dari level.
 *           example: "Level Baru"
 *         description:
 *           type: string
 *           description: Deskripsi singkat tentang level.
 *           example: "Deskripsi untuk level baru."
 *         sequence:
 *           type: integer
 *           description: Nomor urutan untuk menampilkan level.
 *           example: 3
 *
 *     ErrorResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: false
 *         message:
 *           type: string
 *           example: "Terjadi kesalahan pada server."
 *
 *     ValidationError:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           example: "Validasi gagal"
 *         errors:
 *           type: object
 *           properties:
 *             sequence:
 *               type: array
 *               items:
 *                 type: string
 *                 example: ["Nomor urutan harus angka positif."]
 *
 *     UnauthorizedError:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           example: "Akses ditolak. Token tidak disediakan."
 *
 *     ForbiddenError:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           example: "Akses ditolak. Membutuhkan hak akses admin."
 *
 *     NotFoundError:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: false
 *         message:
 *           type: string
 *           example: "Level tidak ditemukan."
 *
 *     ConflictError:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: false
 *         message:
 *           type: string
 *           example: "Nomor urutan sudah digunakan. Silakan gunakan nomor lain."
 */

export const createLevelSchema = z.object({
    name: z.string()
        .min(1, "Nama level tidak boleh kosong.")
        .min(3, "Nama level minimal 3 karakter."),

    description: z.string().optional(),

    sequence: z.number()
        .int("Nomor urutan harus berupa bilangan bulat.")
        .min(1, "Nomor urutan harus angka positif."),
});

export const updateLevelSchema = createLevelSchema.partial();
