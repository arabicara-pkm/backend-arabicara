import { deleteAudio, textToSpeech, uploadAudioStream } from "@/utils/media.helper";
import { createExerciseSchema, updateExerciseSchema } from "../schemas/exercise.schema";
import { PrismaClient } from "@prisma/client";
import z from "zod";

const prisma = new PrismaClient();

type ExerciseData = z.infer<typeof createExerciseSchema>;
type UpdateExerciseData = z.infer<typeof updateExerciseSchema>;

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

    return await prisma.$transaction(async (tx) => {
        const existingExercise = await tx.exercise.findUnique({
            where: { id },
            include: { choices: true },
        });

        if (!existingExercise) {
            throw new Error("Latihan tidak ditemukan");
        }

        let newQuestionVoicePath = existingExercise.voicePath;

        // Jika pertanyaan diubah, buat ulang audionya
        if (question && question !== existingExercise.question) {
            if (existingExercise.voicePath) await deleteAudio(existingExercise.voicePath);
            const questionAudioBuffer = await textToSpeech(question, AUDIO_LANGUAGE);
            newQuestionVoicePath = await uploadAudioStream(questionAudioBuffer);
        }

        const updatedExercise = await tx.exercise.update({
            where: { id },
            data: {
                ...exerciseData,
                ...(question && { question }),
                voicePath: newQuestionVoicePath,
            },
        });

        if (choices && choices.length > 0) {
            await Promise.all(
                existingExercise.choices.map(choice =>
                    choice.voicePath ? deleteAudio(choice.voicePath) : Promise.resolve()
                )
            );
            await tx.answerChoice.deleteMany({ where: { exerciseId: id } });

            const newChoicesWithAudio = await Promise.all(
                choices.map(async (choice) => {
                    const choiceAudioBuffer = await textToSpeech(choice.text, AUDIO_LANGUAGE);
                    const voicePath = await uploadAudioStream(choiceAudioBuffer);
                    return { ...choice, voicePath, exerciseId: id };
                })
            );

            await tx.answerChoice.createMany({ data: newChoicesWithAudio });
        }

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