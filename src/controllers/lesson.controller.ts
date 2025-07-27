// src/controllers/lesson.controller.ts
import { Request, Response } from "express";
import * as LessonService from "../services/lesson.service";
import { createLessonSchema, updateLessonSchema } from "../schemas/lesson.schema";
import { Prisma } from "@prisma/client";

export const getAllLessonsHandler = async (req: Request, res: Response) => {
  try {
    const lessons = await LessonService.getAllLessons();
    res.status(200).json(lessons);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getLessonHandler = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const lesson = await LessonService.getLessonById(id);

    if (!lesson) {
      return res.status(404).json({ message: "Lesson tidak ditemukan." });
    }

    res.status(200).json(lesson);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const createLessonHandler = async (req: Request, res: Response) => {
  const validationResult = createLessonSchema.safeParse(req.body);

  if (!validationResult.success) {
    return res.status(400).json({
      status: "fail",
      message: "Validasi gagal.",
      errors: validationResult.error.flatten().fieldErrors,
    });
  }

  try {
    const { title, content, sequence, level_id, voice_path } = validationResult.data;

    const newLesson = await LessonService.createLesson({
      title,
      content,
      sequence,
      levelId: level_id,
      voicePath: voice_path,
    });
    return res.status(201).json({
      status: "success",
      message: "Lesson berhasil dibuat.",
      data: newLesson,
    });
  } catch (error: any) {
    console.error("Error creating lesson:", error);

    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2003"
    ) {
      return res.status(400).json({
        status: "fail",
        message: "Level tidak ditemukan atau tidak valid.",
      });
    }

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2002') {
        return res.status(409).json({
          success: false,
          message: 'Nomor urutan untuk level ini sudah digunakan. Silakan gunakan nomor lain.',
        });
      }
    }

    return res.status(500).json({
      status: "error",
      message: error.message || "Terjadi kesalahan di server.",
    });
  }
};

export const updateLessonHandler = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const validationResult = updateLessonSchema.safeParse({
      params: req.params,
      body: req.body,
    });

    if (!validationResult.success) {
      return res.status(400).json({
        message: "Validasi gagal",
        errors: validationResult.error.flatten().fieldErrors,
      });
    }

    const updatedLesson = await LessonService.updateLesson(id, req.body);

    res.status(200).json({
      status: "success",
      message: "Lesson berhasil diperbarui.",
      data: updatedLesson,
    });
  } catch (error: any) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2003"
    ) {
      return res.status(404).json({
        status: "fail",
        message: "Gagal memperbarui. Level tidak ditemukan.",
      });
    }

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2002') {
        return res.status(409).json({
          success: false,
          message: 'Nomor urutan untuk level ini sudah digunakan. Silakan gunakan nomor lain.',
        });
      }
    }

    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

export const deleteLessonHandler = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await LessonService.deleteLesson(id);
    res.status(200).json({ message: "Lesson berhasil dihapus." });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};