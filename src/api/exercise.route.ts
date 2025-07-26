import { Router } from 'express';
import * as ExerciseController from '../controllers/exercise.controller';
import { verifyToken, isAdmin } from '../middlewares/auth.middleware';

const router = Router();

/**
 * @swagger
 * /exercises/level/{levelId}:
 *   get:
 *     summary: Mendapatkan latihan untuk level tertentu
 *     tags: [Exercises]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: levelId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID dari level.
 *     responses:
 *       '200':
 *         description: Latihan untuk level ini berhasil didapat.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Exercise'
 *       '401':
 *         description: Unauthorized.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UnauthorizedError'
 *       '404':
 *         description: Latihan tidak ditemukan.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/NotFoundError'
 */
router.get('/level/:levelId', verifyToken, ExerciseController.getByLevelId);

/**
 * @swagger
 * /exercises/final:
 *   get:
 *     summary: Mendapatkan Ujian Akhir (latihan tanpa levelId)
 *     tags: [Exercises]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       '200':
 *         description: Ujian Akhir berhasil didapat.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Exercise'
 *       '401':
 *         description: Unauthorized.
 *       '404':
 *         description: Ujian Akhir tidak ditemukan.
 */
router.get('/final', verifyToken, ExerciseController.getFinal);

/**
 * @swagger
 * /exercises:
 *   post:
 *     summary: Membuat latihan baru (Hanya Admin)
 *     tags: [Exercises]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ExerciseInput'
 *     responses:
 *       '201':
 *         description: Latihan berhasil dibuat.
 *       '400':
 *         description: Validasi gagal.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ValidationError'
 *       '403':
 *         description: Forbidden (Akses ditolak, butuh hak admin).
 */
router.post('/', verifyToken, isAdmin, ExerciseController.create);

/**
 * @swagger
 * /exercises/{id}:
 *   put:
 *     summary: Memperbarui latihan yang ada (Hanya Admin)
 *     tags: [Exercises]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID unik dari latihan.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ExerciseInput'
 *     responses:
 *       '200':
 *         description: Latihan berhasil diperbarui.
 *       '400':
 *         description: Validasi gagal.
 *       '403':
 *         description: Forbidden.
 *       '404':
 *         description: Latihan tidak ditemukan.
 *   delete:
 *     summary: Menghapus sebuah latihan (Hanya Admin)
 *     tags: [Exercises]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID unik dari latihan.
 *     responses:
 *       '200':
 *         description: Latihan berhasil dihapus.
 *       '403':
 *         description: Forbidden.
 *       '404':
 *         description: Latihan tidak ditemukan.
 */
router.put('/:id', verifyToken, isAdmin, ExerciseController.update);
router.delete('/:id', verifyToken, isAdmin, ExerciseController.remove);

export default router;