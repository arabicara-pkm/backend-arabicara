import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const BUCKET_NAME = process.env.GCS_BUCKET_NAME;

export const handleGcsNotification = async (req: Request, res: Response) => {
    // Verifikasi bahwa request datang dari sumber yang sah (opsional tapi direkomendasikan)
    // Di sini kita tidak melakukan verifikasi kompleks, tapi di produksi Anda bisa cek header tertentu.

    // Payload dari GCS ada di req.body.message.data (base64 encoded)
    if (!req.body.message || !req.body.message.data) {
        console.warn("Menerima notifikasi GCS tanpa data.");
        return res.status(204).send(); // Kirim 204 No Content agar GCS berhenti mencoba
    }

    try {
        const dataBuffer = Buffer.from(req.body.message.data, 'base64');
        const notification = JSON.parse(dataBuffer.toString());

        const fileName = notification.name; // Contoh: "lesson-123-audio.mp3"
        console.log(`Menerima notifikasi untuk file: ${fileName}`);

        // Pastikan ini adalah file audio, bukan file teks
        if (!fileName || !fileName.endsWith('.mp3')) {
            return res.status(204).send();
        }

        // Ekstrak ID lesson dari nama file
        const match = fileName.match(/lesson-(\d+)-audio\.mp3/);
        if (!match || !match[1]) {
            console.warn(`Nama file tidak cocok dengan format yang diharapkan: ${fileName}`);
            return res.status(204).send();
        }
        const lessonId = parseInt(match[1]);

        // Buat URL publik untuk file di GCS
        const publicUrl = `https://storage.googleapis.com/${BUCKET_NAME}/${fileName}`;

        // Perbarui record lesson di database
        await prisma.lesson.update({
            where: { id: lessonId },
            data: {
                voicePath: publicUrl,
                audioStatus: 'COMPLETED',
            },
        });

        console.log(`Lesson ${lessonId} berhasil diperbarui dengan voicePath: ${publicUrl}`);
        res.status(204).send(); // Kirim 204 No Content untuk memberitahu GCS bahwa notifikasi berhasil diproses
    } catch (error) {
        console.error("Gagal memproses notifikasi GCS:", error);
        // Kirim status error agar GCS mencoba mengirim notifikasi lagi nanti
        res.status(500).send();
    }
};