import { TextToSpeechClient } from '@google-cloud/text-to-speech';
import { v1 as textToSpeechV1 } from '@google-cloud/text-to-speech';
import { Storage } from '@google-cloud/storage';
import cloudinary from '../config/cloudinary';
import { Readable } from 'stream';

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
 * Memulai proses konversi teks panjang menjadi audio secara asinkron.
 * @param text Konten teks yang panjang.
 * @param outputFileName Nama file untuk output MP3 (tanpa ekstensi).
 * @returns ID Operasi dari Google Cloud.
 */
export const synthesizeLongAudio = async (text: string, outputFileName: string): Promise<string> => {
    const inputFile = `${outputFileName}.txt`;
    const outputFile = `${outputFileName}.mp3`;

    // 1. Unggah file teks ke GCS
    await storage.bucket(bucketName).file(inputFile).save(text);

    // 2. Siapkan request untuk Long Audio API
    const request = {
        parent: `projects/${process.env.GCLOUD_PROJECT}/locations/global`,
        synthesisInput: {
            textSource: { uri: `gs://${bucketName}/${inputFile}` },
        },
        voice: {
            languageCode: 'ar-XA',
            name: 'ar-XA-Wavenet-B',
        },
        audioConfig: {
            audioEncoding: 'MP3' as const,
        },
        outputGcsUri: `gs://${bucketName}/${outputFile}`,
    };

    // 3. Panggil API dan dapatkan ID operasi menggunakan client yang benar
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
        await storage.bucket(bucketName).file(`${fileName.split('.')[0]}.txt`).delete(); // Hapus juga file teksnya
        console.log(`Berhasil menghapus file dari GCS: ${fileName}`);
    } catch (error) {
        console.error(`Gagal menghapus file dari GCS: ${fileName}`, error);
    }
};