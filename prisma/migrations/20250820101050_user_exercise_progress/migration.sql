/*
  Warnings:

  - You are about to drop the column `is_correct` on the `user_exercise_progresses` table. All the data in the column will be lost.
  - Added the required column `status` to the `user_exercise_progresses` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "user_exercise_progresses" DROP COLUMN "is_correct",
ADD COLUMN     "status" TEXT NOT NULL;
