-- DropForeignKey
ALTER TABLE "answer_choices" DROP CONSTRAINT "answer_choices_exercise_id_fkey";

-- DropForeignKey
ALTER TABLE "user_lesson_progresses" DROP CONSTRAINT "user_lesson_progresses_lesson_id_fkey";

-- DropForeignKey
ALTER TABLE "user_lesson_progresses" DROP CONSTRAINT "user_lesson_progresses_user_id_fkey";

-- DropForeignKey
ALTER TABLE "user_level_progresses" DROP CONSTRAINT "user_level_progresses_level_id_fkey";

-- DropForeignKey
ALTER TABLE "user_level_progresses" DROP CONSTRAINT "user_level_progresses_user_id_fkey";

-- AlterTable
ALTER TABLE "answer_choices" ADD COLUMN     "voice_path" TEXT;

-- AlterTable
ALTER TABLE "exercises" ADD COLUMN     "voice_path" TEXT;

-- AddForeignKey
ALTER TABLE "answer_choices" ADD CONSTRAINT "answer_choices_exercise_id_fkey" FOREIGN KEY ("exercise_id") REFERENCES "exercises"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_level_progresses" ADD CONSTRAINT "user_level_progresses_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_level_progresses" ADD CONSTRAINT "user_level_progresses_level_id_fkey" FOREIGN KEY ("level_id") REFERENCES "levels"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_lesson_progresses" ADD CONSTRAINT "user_lesson_progresses_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_lesson_progresses" ADD CONSTRAINT "user_lesson_progresses_lesson_id_fkey" FOREIGN KEY ("lesson_id") REFERENCES "lessons"("id") ON DELETE CASCADE ON UPDATE CASCADE;
