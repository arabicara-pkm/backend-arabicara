// import { Request, Response } from 'express';
// import * as VocabularyService from '../services/vocabulary.service';

// export const getAll = async (req: Request, res: Response) => {
//     try {
//         const data = await VocabularyService.getAllVocabulary();
//         res.status(200).json(data);
//     } catch (error) {
//         res.status(500).json({ message: 'Terjadi kesalahan pada server' });
//     }
// };

// export const create = async (req: Request, res: Response) => {
//     try {
//         const newData = await VocabularyService.createVocabulary(req.body);
//         res.status(201).json(newData);
//     } catch (error: any) {
//         res.status(400).json({ message: error.message });
//     }
// };