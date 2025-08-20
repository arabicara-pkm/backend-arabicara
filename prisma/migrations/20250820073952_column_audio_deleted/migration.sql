/*
  Warnings:

  - You are about to drop the column `audio_operation_id` on the `lessons` table. All the data in the column will be lost.
  - You are about to drop the column `audio_status` on the `lessons` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "lessons_audio_operation_id_key";

-- AlterTable
ALTER TABLE "lessons" DROP COLUMN "audio_operation_id",
DROP COLUMN "audio_status";
