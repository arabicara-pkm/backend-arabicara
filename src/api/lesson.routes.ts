import express from "express";
import * as LessonController from "../controllers/lesson.controller";
import { verifyToken, isAdmin } from "../middlewares/auth.middleware";

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Lesson:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         title:
 *           type: string
 *           example: "Pengenalan Huruf Hijaiyah"
 *         content:
 *           type: string
 *           example: "Konten pelajaran huruf hijaiyah..."
 *         voice_path:
 *           type: string
 *           example: "/uploads/audio/huruf_hijaiyah.mp3"
 *         sequence:
 *           type: integer
 *           example: 1
 *         level_id:
 *           type: integer
 *           example: 2
 *         created_at:
 *           type: string
 *           format: date-time
 *           example: "2025-07-27T10:00:00Z"
 *         updated_at:
 *           type: string
 *           format: date-time
 *           example: "2025-07-27T10:30:00Z"
 *     LessonInput:
 *       type: object
 *       required:
 *         - title
 *         - content
 *         - sequence
 *         - level_id
 *       properties:
 *         title:
 *           type: string
 *           example: "Pengenalan Huruf Hijaiyah"
 *         content:
 *           type: string
 *           example: "Konten pelajaran huruf hijaiyah..."
 *         voice_path:
 *           type: string
 *           example: "/uploads/audio/huruf_hijaiyah.mp3"
 *         sequence:
 *           type: integer
 *           example: 1
 *         level_id:
 *           type: integer
 *           example: 2
 */

/**
 * @swagger
 * tags:
 *   - name: Lesson
 *     description: API untuk manajemen pelajaran (lessons)
 */

/**
 * @swagger
 * /lessons:
 *   get:
 *     summary: Mendapatkan semua data lesson
 *     tags: [Lesson]
 *     responses:
 *       200:
 *         description: Berhasil mengambil data lesson
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Lesson'
 */
router.get("/", LessonController.getAllLessonsHandler);

/**
 * @swagger
 * /lessons/{lessonId}:
 *   get:
 *     summary: Mendapatkan lesson berdasarkan ID
 *     tags: [Lesson]
 *     parameters:
 *       - in: path
 *         name: lessonId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID lesson
 *     responses:
 *       200:
 *         description: Berhasil mengambil data lesson
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Lesson'
 *       404:
 *         description: Lesson tidak ditemukan
 */
router.get("/:id", LessonController.getLessonHandler);

/**
 * @swagger
 * /lessons:
 *   post:
 *     summary: Menambahkan lesson baru
 *     tags: [Lesson]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LessonInput'
 *     responses:
 *       201:
 *         description: Lesson berhasil ditambahkan
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Lesson'
 *       400:
 *         description: Validasi gagal
 *       401:
 *         description: Unauthorized - Token tidak valid
 *       403:
 *         description: Forbidden - Hanya admin yang dapat mengakses
 */
router.post("/", verifyToken, isAdmin, LessonController.createLessonHandler);

/**
 * @swagger
 * /lessons/{lessonId}:
 *   put:
 *     summary: Memperbarui lesson berdasarkan ID
 *     tags: [Lesson]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: lessonId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID lesson yang ingin diperbarui
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LessonInput'
 *     responses:
 *       200:
 *         description: Lesson berhasil diperbarui
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Lesson'
 *       400:
 *         description: Validasi gagal
 *       404:
 *         description: Lesson tidak ditemukan
 *       401:
 *         description: Unauthorized - Token tidak valid
 *       403:
 *         description: Forbidden - Hanya admin yang dapat mengakses
 */
router.put("/:id", verifyToken, isAdmin, LessonController.updateLessonHandler);

/**
 * @swagger
 * /lessons/{lessonId}:
 *   delete:
 *     summary: Menghapus lesson berdasarkan ID
 *     tags: [Lesson]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: lessonId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Lesson berhasil dihapus
 *       404:
 *         description: Lesson tidak ditemukan
 *       401:
 *         description: Unauthorized - Token tidak valid
 *       403:
 *         description: Forbidden - Hanya admin yang dapat mengakses
 */
router.delete("/:id", verifyToken, isAdmin, LessonController.deleteLessonHandler);

/**
 * @swagger
 * /lessons/level/{levelId}:
 *   get:
 *     summary: Mendapatkan semua lesson berdasarkan level
 *     tags: [Lesson]
 *     parameters:
 *       - in: path
 *         name: levelId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID dari level
 *     responses:
 *       200:
 *         description: List lesson dari level tertentu
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Lesson'
 *       404:
 *         description: Tidak ada data untuk level tersebut
 */
router.get("/level/:levelId", LessonController.getLessonsByLevelIdHandler);

export default router;
