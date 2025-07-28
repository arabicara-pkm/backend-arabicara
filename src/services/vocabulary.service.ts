import { PrismaClient } from '@prisma/client';
import { TextToSpeechClient } from '@google-cloud/text-to-speech';
import { uploadAudioStream } from '../utils/media.helper';

const prisma = new PrismaClient();
const ttsClient = new TextToSpeechClient();

type VocabularyInput = {
  arabicText: string;
  indonesianText: string;
  categoryId: number;
};

export const createVocabulary = async (data: VocabularyInput) => {
  const { arabicText, indonesianText, categoryId } = data;

  // 1. Siapkan request untuk Google TTS
  const arabicRequest = {
    input: { text: arabicText },
    voice: { languageCode: 'ar-XA', ssmlGender: 'NEUTRAL' as const },
    audioConfig: { audioEncoding: 'MP3' as const },
  };

  const indonesianRequest = {
    input: { text: indonesianText },
    voice: { languageCode: 'id-ID', ssmlGender: 'NEUTRAL' as const },
    audioConfig: { audioEncoding: 'MP3' as const },
  };

  // 2. Panggil API Google TTS secara bersamaan untuk efisiensi
  const [arabicResponse, indonesianResponse] = await Promise.all([
    ttsClient.synthesizeSpeech(arabicRequest),
    ttsClient.synthesizeSpeech(indonesianRequest),
  ]);

  const arabicAudio = arabicResponse[0].audioContent as Buffer;
  const indonesianAudio = indonesianResponse[0].audioContent as Buffer;

  // 3. Unggah kedua file audio ke Cloudinary secara bersamaan
  const [arabicUrl, indonesianUrl] = await Promise.all([
    uploadAudioStream(arabicAudio),
    uploadAudioStream(indonesianAudio),
  ]);

  // 4. Simpan URL dan data teks ke database
  const newVocabulary = await prisma.vocabulary.create({
    data: {
      arabicText,
      indonesianText,
      arabicVoicePath: arabicUrl,
      indonesianVoicePath: indonesianUrl,
      categoryId,
    },
  });

  return newVocabulary;
};

export const getAllVocabularies = async () => {
  return prisma.vocabulary.findMany({
    include: {
      category: true,
    },
  });
};

export const getVocabularyById = async (id: string) => {
  return prisma.vocabulary.findUnique({
    where: { id: Number(id) },
    include: {
      category: true,
    },
  });
};

export const updateVocabulary = async (
  id: string,
  data: Partial<{
    arabicText: string;
    indonesianText: string;
    categoryId: number;
    arabicVoicePath?: string;
    indonesianVoicePath?: string;
  }>
) => {
  return prisma.vocabulary.update({
    where: { id: Number(id) },
    data,
  });
};

export const deleteVocabulary = async (id: string) => {
  return prisma.vocabulary.delete({
    where: { id: Number(id) },
  });
};

export const vocabularyByCategoryId = async (categoryId: string) => {
  return await prisma.vocabulary.findMany({
    where: {
      categoryId: Number(categoryId),
    },
  });
};