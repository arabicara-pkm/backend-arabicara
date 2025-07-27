// src/routes/vocabulary.route.ts
import express from "express";
import * as VocabularyController from "../controllers/vocabulary.controller";
import { verifyToken, isAdmin } from "../middlewares/auth.middleware";

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Vocabulary:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         arabicText:
 *           type: string
 *           example: "كِتَاب"
 *         indonesianText:
 *           type: string
 *           example: "buku"
 *         categoryId:
 *           type: integer
 *           example: 1
 *         arabicVoicePath:
 *           type: string
 *           example: "/uploads/audio/arabic_kitab.mp3"
 *         indonesianVoicePath:
 *           type: string
 *           example: "/uploads/audio/indonesia_buku.mp3"
 *         createdAt:
 *           type: string
 *           format: date-time
 *           example: "2025-07-26T10:00:00Z"
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           example: "2025-07-26T10:30:00Z"
 *         category:
 *           type: object
 *           properties:
 *             id:
 *               type: integer
 *               example: 1
 *             name:
 *               type: string
 *               example: "Kata Benda"
 *
 *     VocabularyInput:
 *       type: object
 *       required:
 *         - arabicText
 *         - indonesianText
 *         - categoryId
 *       properties:
 *         arabicText:
 *           type: string
 *           example: "كِتَاب"
 *         indonesianText:
 *           type: string
 *           example: "buku"
 *         categoryId:
 *           type: integer
 *           example: 1
 *         arabicVoicePath:
 *           type: string
 *           example: "/uploads/audio/arabic_kitab.mp3"
 *         indonesianVoicePath:
 *           type: string
 *           example: "/uploads/audio/indonesia_buku.mp3"
 */

/**
 * @swagger
 * tags:
 *   - name: Vocabulary
 */


/**
 * @swagger
 * /vocabularies:
 *   get:
 *     summary: Mendapatkan semua data kosakata
 *     tags: [Vocabulary]
 *     responses:
 *       200:
 *         description: Berhasil mengambil data kosakata
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Vocabulary'
 */
router.get("/", VocabularyController.getAllVocabulariesHandler);

/**
 * @swagger
 * /vocabularies/{id}:
 *   get:
 *     summary: Mendapatkan kosakata berdasarkan ID
 *     tags: [Vocabulary]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID kosakata
 *     responses:
 *       200:
 *         description: Berhasil mengambil data kosakata
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Vocabulary'
 *       404:
 *         description: Kosakata tidak ditemukan
 */

// ================= ADMIN-ONLY ROUTES ===================

router.get("/:id", VocabularyController.getVocabularyHandler);

/**
 * @swagger
 * /vocabularies:
 *   post:
 *     summary: Menambahkan kosakata baru
 *     tags: [Vocabulary]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/VocabularyInput'
 *     responses:
 *       201:
 *         description: Kosakata berhasil ditambahkan
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Vocabulary'
 *       400:
 *         description: Validasi gagal
 *       401:
 *         description: Unauthorized - Token tidak valid
 *       403:
 *         description: Forbidden - Hanya admin yang dapat mengakses
 */
router.post("/", verifyToken, isAdmin, VocabularyController.createVocabularyHandler);

/**
 * @swagger
 * /vocabularies/{id}:
 *   put:
 *     summary: Memperbarui kosakata berdasarkan ID
 *     tags: [Vocabulary]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID kosakata yang ingin diperbarui
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/VocabularyInput'
 *     responses:
 *       200:
 *         description: Kosakata berhasil diperbarui
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Vocabulary'
 *       400:
 *         description: Validasi gagal
 *       404:
 *         description: Kosakata tidak ditemukan
 *       401:
 *         description: Unauthorized - Token tidak valid
 *       403:
 *         description: Forbidden - Hanya admin yang dapat mengakses
 */
router.put("/:id", verifyToken, isAdmin, VocabularyController.updateVocabularyHandler);

/**
 * @swagger
 * /vocabularies/{id}:
 *   delete:
 *     summary: Menghapus kosakata berdasarkan ID
 *     tags: [Vocabulary]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         example: 1
 *     responses:
 *       200:
 *         description: Kosakata berhasil dihapus.
 *       404:
 *         description: Kosakata tidak ditemukan.
 *       401:
 *         description: Unauthorized - Token tidak valid
 *       403:
 *         description: Forbidden - Hanya admin yang dapat mengakses
 */
router.delete("/:id", verifyToken, isAdmin, VocabularyController.deleteVocabularyHandler);
/**
 * @swagger
 * /vocabularies/category/{categoryId}:
 *   get:
 *     summary: Mendapatkan daftar kosakata berdasarkan ID kategori
 *     tags: [Vocabulary]
 *     parameters:
 *       - in: path
 *         name: categoryId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID kategori kosakata
 *     responses:
 *       200:
 *         description: Berhasil mengambil kosakata berdasarkan kategori
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Vocabulary'
 *       404:
 *         description: Kosakata tidak ditemukan dalam kategori tersebut
 *       500:
 *         description: Terjadi kesalahan pada server
 */
router.get("/category/:categoryId", VocabularyController.getVocabularyByCategoryIdHandler);
export default router;
