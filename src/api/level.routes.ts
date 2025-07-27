import { Router } from 'express';
import * as LevelController from '../controllers/level.controller';
import { verifyToken, isAdmin } from '../middlewares/auth.middleware';

const router = Router();

/**
 * @swagger
 * /levels:
 *   get:
 *     summary: Mendapatkan semua level
 *     tags: [Levels]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       '200':
 *         description: Daftar semua level berhasil didapat.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Level'
 *       '401':
 *         description: Unauthorized.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UnauthorizedError'
 */
router.get('/', verifyToken, LevelController.getAll);

/**
 * @swagger
 * /levels/{id}:
 *   get:
 *     summary: Mendapatkan detail satu level berdasarkan ID
 *     description: "Mengambil detail untuk satu level. Bisa menyertakan data relasi seperti `lessons` dan `exercise` (lengkap dengan `choices`-nya) menggunakan query parameter `?include`. Contoh: `?include=lessons,exercises`."
 *     tags: [Levels]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: "ID unik dari level."
 *       - in: query
 *         name: include
 *         schema:
 *           type: string
 *           enum: [lessons, exercises]
 *         description: "Sertakan data relasi (pisahkan dengan koma). Pilihan: `lessons`, `exercises`."
 *     responses:
 *       '200':
 *         description: "Detail level berhasil didapat. Respons akan berisi array `lessons` jika `?include=lessons` digunakan."
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LevelWithLessons'
 *       '401':
 *         description: Unauthorized.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UnauthorizedError'
 *       '404':
 *         description: Level tidak ditemukan.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/NotFoundError'
 */
router.get('/:id', verifyToken, LevelController.getById);

/**
 * @swagger
 * /levels:
 *   post:
 *     summary: Membuat level baru (Hanya Admin)
 *     tags: [Levels]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LevelInput'
 *     responses:
 *       '201':
 *         description: Level berhasil dibuat.
 *       '400':
 *         description: Validasi gagal.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ValidationError'
 *       '401':
 *         description: Unauthorized.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UnauthorizedError'
 *       '403':
 *         description: Forbidden (Akses ditolak, butuh hak admin).
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ForbiddenError'
 *       '409':
 *         description: Konflik, nomor urutan sudah ada.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ConflictError'
 */
router.post('/', verifyToken, isAdmin, LevelController.create);

/**
 * @swagger
 * /levels/{id}:
 *   put:
 *     summary: Memperbarui level yang ada (Hanya Admin)
 *     tags: [Levels]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID unik dari level.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LevelInput'
 *     responses:
 *       '200':
 *         description: Level berhasil diperbarui.
 *       '400':
 *         description: Validasi gagal.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ValidationError'
 *       '403':
 *         description: Forbidden.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ForbiddenError'
 *       '404':
 *         description: Level tidak ditemukan.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/NotFoundError'
 *       '409':
 *         description: Konflik, nomor urutan sudah ada.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ConflictError'
 */
router.put('/:id', verifyToken, isAdmin, LevelController.update);

/**
 * @swagger
 * /levels/{id}:
 *   delete:
 *     summary: Menghapus sebuah level (Hanya Admin)
 *     tags: [Levels]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID unik dari level.
 *     responses:
 *       '200':
 *         description: Level berhasil dihapus.
 *       '403':
 *         description: Forbidden.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ForbiddenError'
 *       '404':
 *         description: Level tidak ditemukan.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/NotFoundError'
 */
router.delete('/:id', verifyToken, isAdmin, LevelController.remove);

export default router;
