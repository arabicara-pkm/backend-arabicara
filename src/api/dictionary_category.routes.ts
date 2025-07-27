import express from "express";
import * as CategoryController from "../controllers/dictionary_category.controller";
import { verifyToken, isAdmin } from "../middlewares/auth.middleware";

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
 *           example: 1
 *         name:
 *           type: string
 *           example: "Kata Benda"
 *         created_at:
 *           type: string
 *           format: date-time
 *           example: "2025-07-27T10:00:00Z"
 *         updated_at:
 *           type: string
 *           format: date-time
 *           example: "2025-07-27T10:30:00Z"
 *     CategoryInput:
 *       type: object
 *       required:
 *         - name
 *       properties:
 *         name:
 *           type: string
 *           example: "Kata Kerja"
 */

/**
 * @swagger
 * tags:
 *   - name: Category
 */

/**
 * @swagger
 * /categories:
 *   get:
 *     summary: Mendapatkan semua kategori
 *     tags: [Category]
 *     responses:
 *       200:
 *         description: Berhasil mengambil daftar kategori
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Category'
 */
router.get("/", CategoryController.getAllCategoriesHandler);

/**
 * @swagger
 * /categories/{id}:
 *   get:
 *     summary: Mendapatkan kategori berdasarkan ID beserta kosakata di dalamnya
 *     tags: [Category]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID kategori
 *     responses:
 *       200:
 *         description: Berhasil mengambil kategori beserta kosakatanya
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Kategori berhasil diambil"
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 1
 *                     name:
 *                       type: string
 *                       example: "Kata Benda"
 *                     description:
 *                       type: string
 *                       example: "Kategori kosakata untuk kata benda umum dalam bahasa Arab"
 *                     created_at:
 *                       type: string
 *                       format: date-time
 *                       example: "2025-07-27T13:15:37.932Z"
 *                     updated_at:
 *                       type: string
 *                       format: date-time
 *                       example: "2025-07-27T13:15:37.932Z"
 *                     vocabularies:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Vocabulary'
 *       404:
 *         description: Kategori tidak ditemukan
 */
router.get("/:id", CategoryController.getCategoryHandler);

/**
 * @swagger
 * /categories:
 *   post:
 *     summary: Menambahkan kategori baru
 *     tags: [Category]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CategoryInput'
 *     responses:
 *       201:
 *         description: Kategori berhasil ditambahkan
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Category'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.post("/", verifyToken, isAdmin, CategoryController.createCategoryHandler);

/**
 * @swagger
 * /categories/{id}:
 *   put:
 *     summary: Memperbarui kategori berdasarkan ID
 *     tags: [Category]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CategoryInput'
 *     responses:
 *       200:
 *         description: Kategori berhasil diperbarui
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Category'
 *       404:
 *         description: Kategori tidak ditemukan
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.put("/:id", verifyToken, isAdmin, CategoryController.updateCategoryHandler);

/**
 * @swagger
 * /categories/{id}:
 *   delete:
 *     summary: Menghapus kategori berdasarkan ID
 *     tags: [Category]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Kategori berhasil dihapus
 *       404:
 *         description: Kategori tidak ditemukan
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.delete("/:id", verifyToken, isAdmin, CategoryController.deleteCategoryHandler);

export default router;