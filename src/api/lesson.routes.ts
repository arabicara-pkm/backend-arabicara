import express from "express";
import * as LessonController from "../controllers/lesson.controller";
import { verifyToken, isAdmin } from "../middlewares/auth.middleware";

const router = express.Router();

// /**
//  * @swagger
//  * tags:
//  *   - name: Lessons
//  *     description: API untuk mengelola pelajaran (konten didalam level)
//  */

/**
 * @swagger
 * /lessons:
 *   get:
 *     summary: Mendapatkan semua data lesson
 *     tags: [Lessons]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       '200':
 *         description: Berhasil mengambil data lesson
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Lesson'
 */
router.get("/", verifyToken, LessonController.getAllLessonsHandler);

/**
 * @swagger
 * /lessons/{id}:
 *   get:
 *     summary: Mendapatkan lesson berdasarkan ID
 *     tags: [Lessons]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID dari lesson
 *     responses:
 *       '200':
 *         description: Berhasil mengambil data lesson
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Lesson'
 *       '404':
 *         description: Lesson tidak ditemukan
 */
router.get("/:id", verifyToken, LessonController.getLessonHandler);

/**
 * @swagger
 * /lessons:
 *   post:
 *     summary: Menambahkan lesson baru (Hanya Admin)
 *     tags: [Lessons]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LessonInput'
 *     responses:
 *       '201':
 *         description: Lesson berhasil ditambahkan
 *       '400':
 *         description: Validasi gagal
 *       '403':
 *         description: Forbidden - Hanya admin yang dapat mengakses
 */
router.post("/", verifyToken, isAdmin, LessonController.createLessonHandler);

/**
 * @swagger
 * /lessons/{id}:
 *   put:
 *     summary: Memperbarui lesson berdasarkan ID (Hanya Admin)
 *     tags: [Lessons]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
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
 *       '200':
 *         description: Lesson berhasil diperbarui
 *       '400':
 *         description: Validasi gagal
 *       '403':
 *         description: Forbidden
 *       '404':
 *         description: Lesson tidak ditemukan
 */
router.put("/:id", verifyToken, isAdmin, LessonController.updateLessonHandler);

/**
 * @swagger
 * /lessons/{id}:
 *   delete:
 *     summary: Menghapus lesson berdasarkan ID (Hanya Admin)
 *     tags: [Lessons]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       '200':
 *         description: Lesson berhasil dihapus
 *       '403':
 *         description: Forbidden
 *       '404':
 *         description: Lesson tidak ditemukan
 */
router.delete("/:id", verifyToken, isAdmin, LessonController.deleteLessonHandler);

export default router;
