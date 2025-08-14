/*
  Warnings:

  - A unique constraint covering the columns `[audio_operation_id]` on the table `lessons` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "lessons" ADD COLUMN     "audio_operation_id" TEXT,
ADD COLUMN     "audio_status" TEXT DEFAULT 'NONE';

-- CreateIndex
CREATE UNIQUE INDEX "lessons_audio_operation_id_key" ON "lessons"("audio_operation_id");
