import { Router } from 'express';
import * as UserController from '../controllers/user.controller';
import { verifyToken } from '../middlewares/auth.middleware';

const router = Router();

/**
 * @swagger
 * /users/me:
 *   put:
 *     summary: Memperbarui profil pengguna yang sedang login
 *     tags: [Users]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserUpdateInput'
 *     responses:
 *       '200':
 *         description: Profil berhasil diperbarui.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       '400':
 *         description: Validasi gagal.
 *       '401':
 *         description: Unauthorized (Token tidak valid atau tidak ada).
 */
router.put('/me', verifyToken, UserController.updateCurrentUser);
//lengkapin
/**
 * @swagger
 * /users/me:
 *   delete:
 *     summary: Menghapus akun pengguna yang sedang login
 *     tags: [Users]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       '200':
 *         description: Akun berhasil dihapus.
 *       '401':
 *         description: Unauthorized (Token tidak valid atau tidak ada).
 */
router.delete('/me', verifyToken, UserController.deleteCurrentUser);

export default router;