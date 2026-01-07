import { TextToSpeechClient } from '@google-cloud/text-to-speech';
import { v1 as textToSpeechV1 } from '@google-cloud/text-to-speech';
import { Storage } from '@google-cloud/storage';
import cloudinary from '../config/cloudinary';
import { Readable } from 'stream';
import ffmpeg from 'fluent-ffmpeg';
import fs from 'fs';
import path from 'path';

// Parsing kredensial dari environment variable
const gcpKeyString = process.env.GCP_SERVICE_ACCOUNT_KEY;

if (!gcpKeyString) {
    console.warn("⚠️ PERINGATAN: GCP_SERVICE_ACCOUNT_KEY tidak ditemukan di environment variables.");
}

const gcpKey = gcpKeyString ? JSON.parse(gcpKeyString) : undefined;

const gcpOptions = gcpKey ? { credentials: gcpKey, projectId: process.env.GCLOUD_PROJECT } : {};

// Inisialisasi clients dengan kredensial eksplisit
const ttsClient = new TextToSpeechClient(gcpOptions);
const longAudioTtsClient = new textToSpeechV1.TextToSpeechLongAudioSynthesizeClient(gcpOptions);
const storage = new Storage(gcpOptions);

const bucketName = process.env.GCS_BUCKET_NAME!;

/**
 * Mengubah teks pendek menjadi audio secara langsung (sinkron).
 */
export const textToSpeech = async (text: string, languageCode: 'ar-XA' | 'id-ID'): Promise<Buffer> => {
    const request = {
        input: { text },
        voice: { languageCode, ssmlGender: 'NEUTRAL' as const },
        audioConfig: { audioEncoding: 'MP3' as const },
    };
    const [response] = await ttsClient.synthesizeSpeech(request);
    return response.audioContent as Buffer;
};

/**
 * Mengunggah buffer audio ke Cloudinary (untuk audio pendek).
 */
export const uploadAudioStream = (audioBuffer: Buffer): Promise<string> => {
    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
            { resource_type: 'video', format: 'mp3' },
            (error, result) => {
                if (error) return reject(error);
                if (result) resolve(result.secure_url);
            }
        );
        Readable.from(audioBuffer).pipe(uploadStream);
    });
};

/**
 * Membuat satu file audio dari teks yang berisi campuran bahasa Arab dan Indonesia.
 */
export const createMultiLanguageAudio = async (content: string): Promise<Buffer> => {
    const lines = content.split('\n').filter(line => line.trim() !== '');
    const tempDir = path.join(__dirname, 'temp_audio');
    if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir);

    const audioFiles: string[] = [];

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        const isArabic = /[\u0600-\u06FF]/.test(line);
        const lang: 'ar-XA' | 'id-ID' = isArabic ? 'ar-XA' : 'id-ID';

        if (/^[a-zA-Z\s]+:$/.test(line.trim())) continue;

        try {
            const audioBuffer = await textToSpeech(line, lang);
            const tempFilePath = path.join(tempDir, `segment-${i}.mp3`);
            fs.writeFileSync(tempFilePath, audioBuffer);
            audioFiles.push(tempFilePath);
        } catch (err) {
            console.error(`Gagal TTS untuk baris: ${line}`, err);
        }
    }

    return new Promise((resolve, reject) => {
        if (audioFiles.length === 0) return resolve(Buffer.from(''));

        const outputFilePath = path.join(tempDir, 'output.mp3');
        const command = ffmpeg();

        audioFiles.forEach(file => {
            command.input(file);
        });

        command
            .on('error', (err) => {
                console.error('Error during ffmpeg processing:', err);
                audioFiles.forEach(file => fs.existsSync(file) && fs.unlinkSync(file));
                if (fs.existsSync(outputFilePath)) fs.unlinkSync(outputFilePath);
                reject(err);
            })
            .on('end', () => {
                const finalBuffer = fs.readFileSync(outputFilePath);
                audioFiles.forEach(file => fs.existsSync(file) && fs.unlinkSync(file));
                fs.unlinkSync(outputFilePath);
                resolve(finalBuffer);
            })
            .mergeToFile(outputFilePath, tempDir);
    });
};

/**
 * Menghapus file audio dari Cloudinary.
 */
export const deleteAudio = async (url: string) => {
    try {
        const publicIdWithFormat = url.split('/').pop();
        if (!publicIdWithFormat) return;

        const publicId = publicIdWithFormat.split('.')[0];
        await cloudinary.uploader.destroy(publicId, { resource_type: 'video' });
        console.log(`Berhasil menghapus audio: ${publicId}`);
    } catch (error) {
        console.error("Gagal menghapus audio dari Cloudinary:", error);
    }
};