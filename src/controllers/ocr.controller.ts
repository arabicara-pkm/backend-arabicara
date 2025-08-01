import { Request, Response } from 'express';
import * as OcrService from '../services/ocr.service';

export const scanImage = async (req: Request, res: Response) => {
    if (!req.file) {
        return res.status(400).json({ message: 'Tidak ada file gambar yang diunggah.' });
    }

    try {
        const imageBuffer = req.file.buffer;
        const recognizedText = await OcrService.recognizeArabicText(imageBuffer);

        res.status(200).json({
            status: 'success',
            data: {
                text: recognizedText,
            },
        });
    } catch (error: any) {
        console.error("Error saat melakukan OCR:", error);
        res.status(500).json({ message: 'Gagal melakukan OCR.', error: error.message });
    }
};