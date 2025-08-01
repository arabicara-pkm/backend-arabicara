import { z } from 'zod';

const singleSubmissionSchema = z.object({
    exerciseId: z.number().int().positive(),
    answerIds: z.array(z.number().int().positive()).min(1, "Minimal satu jawaban harus dipilih untuk setiap soal."),
});

export const submitLevelExerciseSchema = z.object({
    submissions: z.array(singleSubmissionSchema)
});