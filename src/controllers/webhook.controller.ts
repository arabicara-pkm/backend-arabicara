import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { Storage } from '@google-cloud/storage';

const prisma = new PrismaClient();
const storage = new Storage();
const BUCKET_NAME = process.env.GCS_BUCKET_NAME;

export const handleGcsNotification = async (req: Request, res: Response) => {
    if (!req.body.message || !req.body.message.data) {
        console.warn("Menerima notifikasi GCS tanpa data.");
        return res.status(204).send();
    }

    try {
        const dataBuffer = Buffer.from(req.body.message.data, 'base64');
        const notification = JSON.parse(dataBuffer.toString());

        const fileName = notification.name; // Contoh: "lesson-123-audio.wav"
        console.log(`Menerima notifikasi untuk file: ${fileName}`);

        if (!fileName || !fileName.endsWith('.wav')) {
            console.log(`File dilewati karena bukan .wav: ${fileName}`);
            return res.status(204).send();
        }

        const match = fileName.match(/lesson-(\d+)-audio\.wav/);
        if (!match || !match[1]) {
            console.warn(`Nama file tidak cocok dengan format yang diharapkan: ${fileName}`);
            return res.status(204).send();
        }
        const lessonId = parseInt(match[1]);

        // Buat URL publik untuk file di GCS
        await storage.bucket(BUCKET_NAME!).file(fileName).makePublic();
        console.log(`File gs://${BUCKET_NAME}/${fileName} telah dijadikan publik.`);

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
        res.status(204).send();
    } catch (error) {
        console.error("Gagal memproses notifikasi GCS:", error);
        res.status(500).send();
    }
};