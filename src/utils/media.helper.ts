import { TextToSpeechClient } from '@google-cloud/text-to-speech';
import { v1 as textToSpeechV1 } from '@google-cloud/text-to-speech';
import { Storage } from '@google-cloud/storage';
import cloudinary from '../config/cloudinary';
import { Readable } from 'stream';
import ffmpeg from 'fluent-ffmpeg';
import fs from 'fs';
import path from 'path';

const ttsClient = new TextToSpeechClient();
const longAudioTtsClient = new textToSpeechV1.TextToSpeechLongAudioSynthesizeClient();
const storage = new Storage();
const bucketName = process.env.GCS_BUCKET_NAME!;

/**
 * Mengubah teks pendek menjadi audio secara langsung (sinkron).
 * @param text Teks pendek yang akan diubah.
 * @param languageCode Kode bahasa.
 * @returns Buffer audio MP3.
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
 * @param audioBuffer Buffer audio dari textToSpeechShort.
 * @returns URL aman dari file yang diunggah.
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
 * @param content Teks lengkap yang akan diproses.
 * @returns Buffer dari file MP3 yang sudah digabung.
 */
export const createMultiLanguageAudio = async (content: string): Promise<Buffer> => {
    const lines = content.split('\n').filter(line => line.trim() !== '');
    const tempDir = path.join(__dirname, 'temp_audio');
    if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir);

    const audioFiles: string[] = [];

    // Buat file audio untuk setiap baris
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        // Deteksi bahasa sederhana: jika mengandung karakter Arab, anggap bahasa Arab
        const isArabic = /[\u0600-\u06FF]/.test(line);
        const lang: 'ar-XA' | 'id-ID' = isArabic ? 'ar-XA' : 'id-ID';

        // Abaikan baris yang hanya berisi nama pembicara (misal: "Zahrah:")
        if (/^[a-zA-Z\s]+:$/.test(line.trim())) continue;

        const audioBuffer = await textToSpeech(line, lang);
        const tempFilePath = path.join(tempDir, `segment-${i}.mp3`);
        fs.writeFileSync(tempFilePath, audioBuffer);
        audioFiles.push(tempFilePath);
    }

    // Gabungkan semua file audio menjadi satu menggunakan ffmpeg
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
                // Hapus file sementara
                audioFiles.forEach(file => fs.unlinkSync(file));
                if (fs.existsSync(outputFilePath)) fs.unlinkSync(outputFilePath);
                reject(err);
            })
            .on('end', () => {
                const finalBuffer = fs.readFileSync(outputFilePath);
                // Hapus semua file sementara
                audioFiles.forEach(file => fs.unlinkSync(file));
                fs.unlinkSync(outputFilePath);
                resolve(finalBuffer);
            })
            .mergeToFile(outputFilePath, tempDir);
    });
};

/**
 * Memulai proses konversi teks panjang menjadi audio secara asinkron.
 * @param text Konten teks yang panjang.
 * @param outputFileName Nama file untuk output (tanpa ekstensi).
 * @returns ID Operasi dari Google Cloud.
 */
export const synthesizeLongAudio = async (text: string, outputFileName: string): Promise<string> => {
    const outputFile = `${outputFileName}.wav`;

    // Siapkan request untuk Long Audio API
    const request = {
        parent: `projects/${process.env.GCLOUD_PROJECT}/locations/global`,
        input: { text },
        voice: {
            languageCode: 'ar-XA',
            name: 'ar-XA-Wavenet-B',
        },
        audioConfig: {
            audioEncoding: 'LINEAR16' as const,
        },
        outputGcsUri: `gs://${bucketName}/${outputFile}`,
    };

    // Panggil API dan dapatkan ID operasi menggunakan client yang benar
    const [operation] = await longAudioTtsClient.synthesizeLongAudio(request);
    const operationId = operation.name!;
    return operationId;
};

/**
 * Menghapus file audio dari Cloudinary.
 * @param url URL file di Cloudinary.
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

/**
 * Menghapus file dari Google Cloud Storage.
 * @param fileName Nama file yang akan dihapus (misal: "lesson-123-audio.mp3").
 */
export const deleteAudioFromGCS = async (fileName: string) => {
    try {
        await storage.bucket(bucketName).file(fileName).delete();
        console.log(`Berhasil menghapus file dari GCS: ${fileName}`);
    } catch (error) {
        console.error(`Gagal menghapus file dari GCS: ${fileName}`, error);
    }
};