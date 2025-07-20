// src/routes/vocabulary.route.ts
import express from "express";
import * as VocabularyController from "@/controllers/vocabulary.controller";
import { validate } from "@/middlewares/validate";
import { createVocabularySchema, updateVocabularySchema } from "@/schemas/vocabulary.schema";
import { isAdmin } from "@/middlewares/auth.middleware"; // middleware untuk cek apakah user admin

const router = express.Router();

// Public Routes
router.get("/", VocabularyController.getAllVocabulariesHandler);
router.get("/:id", VocabularyController.getVocabularyHandler);

// Admin-only Routes
router.post("/", isAdmin, validate(createVocabularySchema), VocabularyController.createVocabularyHandler);
router.put("/:id", isAdmin, validate(updateVocabularySchema), VocabularyController.updateVocabularyHandler);
router.delete("/:id", isAdmin, VocabularyController.deleteVocabularyHandler);

export default router;
