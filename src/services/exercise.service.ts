import { deleteAudio, textToSpeech, uploadAudioStream } from "../utils/media.helper";
import { createExerciseSchema, updateExerciseSchema } from "../schemas/exercise.schema";
import { PrismaClient } from "@prisma/client";
import z from "zod";
import { submitLevelExerciseSchema } from "@/schemas/submission.schema";

const prisma = new PrismaClient();

type ExerciseData = z.infer<typeof createExerciseSchema>;
type UpdateExerciseData = z.infer<typeof updateExerciseSchema>;
type LevelSubmissionData = z.infer<typeof submitLevelExerciseSchema>;

const AUDIO_LANGUAGE = 'ar-XA';

export const getFinalExam = async () => {
    return await prisma.exercise.findMany({
        where: { levelId: null },
        include: { choices: true }
    });
}

export const createExercise = async (data: ExerciseData) => {
    const { choices, question, ...exerciseData } = data;

    const questionAudioBuffer = await textToSpeech(question, AUDIO_LANGUAGE);
    const questionVoicePath = await uploadAudioStream(questionAudioBuffer);

    const choicesWithAudio = await Promise.all(
        choices.map(async (choice) => {
            const choiceAudioBuffer = await textToSpeech(choice.text, AUDIO_LANGUAGE);
            const voicePath = await uploadAudioStream(choiceAudioBuffer);
            return { ...choice, voicePath };
        })
    );

    return await prisma.$transaction(async (tx) => {
        const exercise = await tx.exercise.create({
            data: {
                ...exerciseData,
                question,
                voicePath: questionVoicePath,
            },
        });

        const choicesData = choicesWithAudio.map(choice => ({
            ...choice,
            exerciseId: exercise.id,
        }));

        await tx.answerChoice.createMany({
            data: choicesData,
        });

        return { ...exercise, choices: choicesWithAudio };
    });

}

export const updateExercise = async (id: number, data: UpdateExerciseData) => {
    const { choices, question, ...exerciseData } = data;

    // Ambil data exercise lama untuk perbandingan dan penghapusan file
    const existingExercise = await prisma.exercise.findUnique({
        where: { id },
        include: { choices: true },
    });

    if (!existingExercise) {
        throw new Error("Latihan tidak ditemukan");
    }

    let newQuestionVoicePath = existingExercise.voicePath;
    let newChoicesWithAudioData: any[] | undefined = undefined;

    // Jika pertanyaan diubah, siapkan audio baru
    if (question && question !== existingExercise.question) {
        console.log("Pertanyaan berubah, menyiapkan audio baru...");
        if (existingExercise.voicePath) await deleteAudio(existingExercise.voicePath);
        const questionAudioBuffer = await textToSpeech(question, AUDIO_LANGUAGE);
        newQuestionVoicePath = await uploadAudioStream(questionAudioBuffer);
    }

    // Jika pilihan jawaban diubah, siapkan audio baru
    if (choices && choices.length > 0) {
        console.log("Pilihan jawaban berubah, menyiapkan audio baru...");
        // Hapus semua file audio dari pilihan jawaban lama
        await Promise.all(
            existingExercise.choices.map(choice =>
                choice.voicePath ? deleteAudio(choice.voicePath) : Promise.resolve()
            )
        );

        // Buat audio dan data baru untuk pilihan jawaban
        newChoicesWithAudioData = await Promise.all(
            choices.map(async (choice) => {
                const choiceAudioBuffer = await textToSpeech(choice.text, AUDIO_LANGUAGE);
                const voicePath = await uploadAudioStream(choiceAudioBuffer);
                return { ...choice, voicePath, exerciseId: id };
            })
        );
    }

    return await prisma.$transaction(async (tx) => {
        // Update exercise utama dengan data yang sudah disiapkan
        await tx.exercise.update({
            where: { id },
            data: {
                ...exerciseData,
                ...(question && { question }),
                voicePath: newQuestionVoicePath,
            },
        });

        // Jika ada data pilihan jawaban baru, perbarui di database
        if (newChoicesWithAudioData) {
            // Hapus record pilihan jawaban lama dari database
            await tx.answerChoice.deleteMany({ where: { exerciseId: id } });
            // Buat record pilihan jawaban yang baru
            await tx.answerChoice.createMany({ data: newChoicesWithAudioData });
        }

        // Ambil dan kembalikan data exercise yang sudah lengkap dan terbaru
        return await tx.exercise.findUnique({
            where: { id },
            include: { choices: true },
        });
    });
}

export const deleteExercise = async (id: number) => {
    return await prisma.$transaction(async (tx) => {
        const exerciseToDelete = await tx.exercise.findUnique({
            where: { id },
            include: { choices: true },
        });

        if (exerciseToDelete) {
            const urlsToDelete: string[] = [];
            if (exerciseToDelete.voicePath) urlsToDelete.push(exerciseToDelete.voicePath);
            exerciseToDelete.choices.forEach(choice => {
                if (choice.voicePath) urlsToDelete.push(choice.voicePath);
            });

            await Promise.all(urlsToDelete.map(url => deleteAudio(url)));
        }

        return await tx.exercise.delete({
            where: { id },
        });
    });
};

export const submitLevelAnswers = async (userId: string, levelId: number, data: LevelSubmissionData) => {
    const { submissions } = data;

    const exercisesInLevel = await prisma.exercise.findMany({
        where: { levelId },
        include: {
            choices: {
                where: { isCorrect: true },
            },
        },
    });

    if (exercisesInLevel.length === 0) {
        throw new Error("Tidak ada latihan yang ditemukan untuk level ini.");
    }

    // Buat "peta" jawaban benar untuk pengecekan yang cepat
    const correctAnswersMap = new Map<number, Set<number>>();
    exercisesInLevel.forEach(exercise => {
        const correctIds = new Set(exercise.choices.map(choice => choice.id));
        correctAnswersMap.set(exercise.id, correctIds);
    });

    // Hitung berapa banyak soal yang dijawab dengan benar
    let correctlyAnsweredQuestions = 0;
    submissions.forEach(submission => {
        const correctIds = correctAnswersMap.get(submission.exerciseId);
        const submittedIds = new Set(submission.answerIds);

        // Jawaban dianggap benar jika set jawaban yang dikirim sama persis dengan set jawaban yang benar
        if (correctIds && submittedIds.size === correctIds.size) {
            let allMatch = true;
            for (const id of submittedIds) {
                if (!correctIds.has(id)) {
                    allMatch = false;
                    break;
                }
            }
            if (allMatch) {
                correctlyAnsweredQuestions++;
            }
        }
    });

    // Hitung skor akhir
    const totalQuestions = exercisesInLevel.length;
    const score = (correctlyAnsweredQuestions / totalQuestions) * 100;

    // Simpan atau perbarui progres pengguna untuk level ini
    await prisma.userLevelProgress.upsert({
        where: {
            userId_levelId: { userId, levelId },
        },
        update: {
            score,
            status: 'completed',
            completedAt: new Date(),
        },
        create: {
            userId,
            levelId,
            score,
            status: 'completed',
            completedAt: new Date(),
        },
    });

    // Kembalikan hasil akhir
    return {
        score: Math.round(score),
        totalQuestions,
        correctlyAnsweredQuestions,
    };
};
