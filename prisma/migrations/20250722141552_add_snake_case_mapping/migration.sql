/*
  Warnings:

  - You are about to drop the `AnswerChoice` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `DictionaryCategory` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Exercise` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Lesson` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Level` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `UserLessonProgress` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `UserLevelProgress` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Vocabulary` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "AnswerChoice" DROP CONSTRAINT "AnswerChoice_exerciseId_fkey";

-- DropForeignKey
ALTER TABLE "Exercise" DROP CONSTRAINT "Exercise_levelId_fkey";

-- DropForeignKey
ALTER TABLE "Lesson" DROP CONSTRAINT "Lesson_levelId_fkey";

-- DropForeignKey
ALTER TABLE "UserLessonProgress" DROP CONSTRAINT "UserLessonProgress_lessonId_fkey";

-- DropForeignKey
ALTER TABLE "UserLessonProgress" DROP CONSTRAINT "UserLessonProgress_userId_fkey";

-- DropForeignKey
ALTER TABLE "UserLevelProgress" DROP CONSTRAINT "UserLevelProgress_levelId_fkey";

-- DropForeignKey
ALTER TABLE "UserLevelProgress" DROP CONSTRAINT "UserLevelProgress_userId_fkey";

-- DropForeignKey
ALTER TABLE "Vocabulary" DROP CONSTRAINT "Vocabulary_categoryId_fkey";

-- DropTable
DROP TABLE "AnswerChoice";

-- DropTable
DROP TABLE "DictionaryCategory";

-- DropTable
DROP TABLE "Exercise";

-- DropTable
DROP TABLE "Lesson";

-- DropTable
DROP TABLE "Level";

-- DropTable
DROP TABLE "User";

-- DropTable
DROP TABLE "UserLessonProgress";

-- DropTable
DROP TABLE "UserLevelProgress";

-- DropTable
DROP TABLE "Vocabulary";

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT,
    "avatar" TEXT,
    "google_id" TEXT,
    "role" TEXT NOT NULL DEFAULT 'student',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "dictionary_categories" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "dictionary_categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "vocabularies" (
    "id" SERIAL NOT NULL,
    "arabic_text" TEXT NOT NULL,
    "indonesian_text" TEXT NOT NULL,
    "arabic_voice_path" TEXT,
    "indonesian_voice_path" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "category_id" INTEGER NOT NULL,

    CONSTRAINT "vocabularies_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "levels" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "sequence" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "levels_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "lessons" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "voice_path" TEXT,
    "sequence" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "level_id" INTEGER NOT NULL,

    CONSTRAINT "lessons_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "exercises" (
    "id" SERIAL NOT NULL,
    "question" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "level_id" INTEGER,

    CONSTRAINT "exercises_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "answer_choices" (
    "id" SERIAL NOT NULL,
    "text" TEXT NOT NULL,
    "is_correct" BOOLEAN NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "exercise_id" INTEGER NOT NULL,

    CONSTRAINT "answer_choices_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_level_progresses" (
    "id" SERIAL NOT NULL,
    "status" TEXT NOT NULL,
    "score" DOUBLE PRECISION,
    "completed_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "user_id" TEXT NOT NULL,
    "level_id" INTEGER NOT NULL,

    CONSTRAINT "user_level_progresses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_lesson_progresses" (
    "id" SERIAL NOT NULL,
    "status" TEXT NOT NULL,
    "completed_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "user_id" TEXT NOT NULL,
    "lesson_id" INTEGER NOT NULL,

    CONSTRAINT "user_lesson_progresses_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_google_id_key" ON "users"("google_id");

-- CreateIndex
CREATE UNIQUE INDEX "levels_sequence_key" ON "levels"("sequence");

-- CreateIndex
CREATE UNIQUE INDEX "lessons_level_id_sequence_key" ON "lessons"("level_id", "sequence");

-- CreateIndex
CREATE UNIQUE INDEX "user_level_progresses_user_id_level_id_key" ON "user_level_progresses"("user_id", "level_id");

-- CreateIndex
CREATE UNIQUE INDEX "user_lesson_progresses_user_id_lesson_id_key" ON "user_lesson_progresses"("user_id", "lesson_id");

-- AddForeignKey
ALTER TABLE "vocabularies" ADD CONSTRAINT "vocabularies_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "dictionary_categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lessons" ADD CONSTRAINT "lessons_level_id_fkey" FOREIGN KEY ("level_id") REFERENCES "levels"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "exercises" ADD CONSTRAINT "exercises_level_id_fkey" FOREIGN KEY ("level_id") REFERENCES "levels"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "answer_choices" ADD CONSTRAINT "answer_choices_exercise_id_fkey" FOREIGN KEY ("exercise_id") REFERENCES "exercises"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_level_progresses" ADD CONSTRAINT "user_level_progresses_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_level_progresses" ADD CONSTRAINT "user_level_progresses_level_id_fkey" FOREIGN KEY ("level_id") REFERENCES "levels"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_lesson_progresses" ADD CONSTRAINT "user_lesson_progresses_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_lesson_progresses" ADD CONSTRAINT "user_lesson_progresses_lesson_id_fkey" FOREIGN KEY ("lesson_id") REFERENCES "lessons"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
