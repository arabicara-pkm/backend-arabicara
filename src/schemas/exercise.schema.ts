import { z } from 'zod';

/**
 * @swagger
 * components:
 *   schemas:
 *     AnswerChoice:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: ID unik untuk pilihan jawaban.
 *         text:
 *           type: string
 *           description: Teks dari pilihan jawaban.
 *           example: "Benar"
 *         isCorrect:
 *           type: boolean
 *           description: Menandakan apakah ini jawaban yang benar.
 *           example: true
 *         exerciseId:
 *           type: integer
 *           description: ID dari exercise yang memiliki pilihan ini.
 *
 *     Exercise:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: ID unik untuk exercise.
 *         question:
 *           type: string
 *           description: Teks pertanyaan.
 *           example: "Apa arti dari 'مرحبا'?"
 *         type:
 *           type: string
 *           description: Tipe dari exercise.
 *           example: "MULTIPLE_CHOICE"
 *         levelId:
 *           type: integer
 *           nullable: true
 *           description: ID dari level yang memiliki exercise ini. Null jika ini adalah ujian akhir.
 *           example: 1
 *         choices:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/AnswerChoice'
 *
 *     AnswerChoiceInput:
 *       type: object
 *       required:
 *         - text
 *         - isCorrect
 *       properties:
 *         text:
 *           type: string
 *           example: "Selamat Pagi"
 *         isCorrect:
 *           type: boolean
 *           example: false
 *
 *     ExerciseInput:
 *       type: object
 *       required:
 *         - question
 *         - choices
 *       properties:
 *         question:
 *           type: string
 *           example: "Apa arti dari 'شكرا'?"
 *         type:
 *           type: string
 *           example: "MULTIPLE_CHOICE"
 *         levelId:
 *           type: integer
 *           nullable: true
 *           example: 2
 *         choices:
 *           type: array
 *           minItems: 2
 *           items:
 *             $ref: '#/components/schemas/AnswerChoiceInput'
 */

const answerChoiceSchema = z.object({
    text: z.string().nonempty("Teks jawaban tidak boleh kosong."),
    voicePath: z.string().optional(),
    isCorrect: z.boolean(),
});

export const createExerciseSchema = z.object({
    question: z.string().nonempty("Pertanyaan tidak boleh kosong."),
    type: z.string().default('MULTIPLE_CHOICE'),
    levelId: z.number().int().positive().optional().nullable(),
    choices: z.array(answerChoiceSchema)
        .min(2, "Minimal harus ada 2 pilihan jawaban.")
        .refine((choices) => choices.some(choice => choice.isCorrect), {
            message: "Setidaknya satu pilihan jawaban harus ditandai benar.",
        }),
});

export const updateExerciseSchema = createExerciseSchema.partial();
