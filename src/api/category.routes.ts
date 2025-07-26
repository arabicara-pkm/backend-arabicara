import express from "express";
import { createCategory, getAllCategories } from "../controllers/category.controller";

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Category:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: ID unik untuk kategori.
 *           example: 1
 *         name:
 *           type: string
 *           description: Nama kategori.
 *           example: "Kata Benda"
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Waktu kategori dibuat.
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Waktu kategori terakhir diperbarui.
 *
 *     CategoryInput:
 *       type: object
 *       required:
 *         - name
 *       properties:
 *         name:
 *           type: string
 *           description: Nama kategori.
 *           example: "Kata Kerja"
 *
 *     CategoryError:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: false
 *         message:
 *           type: string
 *           example: "Terjadi kesalahan saat memproses kategori."
 *
 *     CategoryValidationError:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           example: "Validasi gagal"
 *         errors:
 *           type: object
 *           properties:
 *             name:
 *               type: array
 *               items:
 *                 type: string
 *               example: ["Nama kategori tidak boleh kosong."]
 */

/**
 * @swagger
 * /api/categories:
 *   post:
 *     summary: Membuat kategori baru.
 *     tags: [Category]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CategoryInput'
 *     responses:
 *       201:
 *         description: Kategori berhasil dibuat.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Category'
 *       400:
 *         description: Validasi gagal.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CategoryValidationError'
 *       500:
 *         description: Terjadi kesalahan server.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CategoryError'
 */
router.post("/", createCategory);
/**
 * @swagger
 * /api/categories:
 *   get:
 *     summary: Mengambil seluruh kategori.
 *     tags: [Category]
 *     responses:
 *       200:
 *         description: Daftar semua kategori.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Category'
 *       500:
 *         description: Terjadi kesalahan server.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CategoryError'
 */
router.get("/", getAllCategories);

export default router;