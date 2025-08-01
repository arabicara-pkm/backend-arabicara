import { Router } from 'express';
import * as OcrController from '../controllers/ocr.controller';
import upload from '../middlewares/upload.middleware';
import { verifyToken } from '../middlewares/auth.middleware';

const router = Router();

/**
 * @swagger
 * tags:
 *   - name: OCR
 *     description: API untuk mengenali teks Arab dari gambar
 */

/**
 * @swagger
 * /ocr/scan:
 *   post:
 *     summary: Mengunggah gambar untuk dikenali teks Arabnya
 *     tags: [OCR]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: File gambar yang berisi teks Arab.
 *     responses:
 *       '200':
 *         description: Teks berhasil dikenali.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   type: object
 *                   properties:
 *                     text:
 *                       type: string
 *                       example: "السلام عليكم"
 *       '400':
 *         description: Tidak ada file yang diunggah.
 *       '401':
 *         description: Unauthorized.
 */
router.post(
    '/scan',
    verifyToken,
    upload.single('image'),
    OcrController.scanImage
);

export default router;