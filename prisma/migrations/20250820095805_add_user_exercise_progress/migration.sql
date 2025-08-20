-- CreateTable
CREATE TABLE "user_exercise_progresses" (
    "id" SERIAL NOT NULL,
    "is_correct" BOOLEAN NOT NULL,
    "completed_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "user_id" TEXT NOT NULL,
    "exercise_id" INTEGER NOT NULL,

    CONSTRAINT "user_exercise_progresses_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_exercise_progresses_user_id_exercise_id_key" ON "user_exercise_progresses"("user_id", "exercise_id");

-- AddForeignKey
ALTER TABLE "user_exercise_progresses" ADD CONSTRAINT "user_exercise_progresses_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_exercise_progresses" ADD CONSTRAINT "user_exercise_progresses_exercise_id_fkey" FOREIGN KEY ("exercise_id") REFERENCES "exercises"("id") ON DELETE CASCADE ON UPDATE CASCADE;
