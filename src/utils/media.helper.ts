import { TextToSpeechClient } from '@google-cloud/text-to-speech';
import cloudinary from '../config/cloudinary';
import { Readable } from 'stream';

const ttsClient = new TextToSpeechClient();

// Fungsi untuk mengubah teks menjadi audio buffer
export const textToSpeech = async (text: string, languageCode: 'ar-XA' | 'id-ID'): Promise<Buffer> => {
    const request = {
        input: { text },
        voice: { languageCode, ssmlGender: 'NEUTRAL' as const },
        audioConfig: { audioEncoding: 'MP3' as const },
    };
    const [response] = await ttsClient.synthesizeSpeech(request);
    return response.audioContent as Buffer;
};

// Fungsi untuk mengunggah audio ke Cloudinary
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

// Fungsi BARU untuk menghapus audio dari Cloudinary
export const deleteAudio = async (url: string) => {
    try {
        // Ekstrak public_id dari URL. Contoh: .../upload/v12345/public_id.mp3
        const publicIdWithFormat = url.split('/').pop();
        if (!publicIdWithFormat) return;

        const publicId = publicIdWithFormat.split('.')[0];
        await cloudinary.uploader.destroy(publicId, { resource_type: 'video' });
        console.log(`Berhasil menghapus audio: ${publicId}`);
    } catch (error) {
        console.error("Gagal menghapus audio dari Cloudinary:", error);
    }
};