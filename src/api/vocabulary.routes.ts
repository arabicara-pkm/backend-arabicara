// src/routes/vocabulary.route.ts
import express from "express";
import * as VocabularyController from "../controllers/vocabulary.controller";
import { validate } from "../middlewares/validate";
import { createVocabularySchema, updateVocabularySchema } from "../schemas/vocabulary.schema";
import { verifyToken, isAdmin } from "../middlewares/auth.middleware"; // middleware untuk cek apakah user admin

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
 *         category:
 *           type: object
 *           properties:
 *             id:
 *               type: integer
 *               example: 1
 *             name:
 *               type: string
 *               example: "Kata Benda"
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

// Public Routes
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
router.get("/:id", VocabularyController.getVocabularyHandler);

// Admin-only Routes
/**
 * @swagger
 * /vocabularies:
 *   post:
 *     summary: Menambahkan kosakata baru
 *     tags: [Vocabulary]
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
 */
router.post("/", verifyToken, isAdmin, VocabularyController.createVocabularyHandler);

/**
 * @swagger
 * /vocabularies/{id}:
 *   put:
 *     summary: Memperbarui kosakata berdasarkan ID
 *     tags: [Vocabulary]
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
 */
router.put("/:id", verifyToken, isAdmin, validate(updateVocabularySchema), VocabularyController.updateVocabularyHandler);

/**
 * @swagger
 * /vocabularies/{id}:
 *   delete:
 *     summary: Menghapus kosakata berdasarkan ID
 *     tags: [Vocabulary]
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
 */
router.delete("/:id", verifyToken, isAdmin, VocabularyController.deleteVocabularyHandler);

export default router;
