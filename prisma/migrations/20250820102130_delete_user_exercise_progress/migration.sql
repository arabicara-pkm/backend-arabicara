/*
  Warnings:

  - You are about to drop the `user_exercise_progresses` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "user_exercise_progresses" DROP CONSTRAINT "user_exercise_progresses_exercise_id_fkey";

-- DropForeignKey
ALTER TABLE "user_exercise_progresses" DROP CONSTRAINT "user_exercise_progresses_user_id_fkey";

-- DropTable
DROP TABLE "user_exercise_progresses";
