// // src/api/vocabulary.routes.ts

// import { Router } from 'express';
// import * as VocabularyController from '../controllers/vocabulary.controller';
// import { verifyToken, isAdmin } from '../middlewares/auth.middleware';

// const router = Router();

// // Rute GET ini bersifat publik, semua orang bisa melihat kamus
// router.get('/', VocabularyController.getAll);

// // Rute POST, PUT, DELETE ini dilindungi.
// // Pertama, verifyToken akan memeriksa tokennya valid atau tidak.
// // Jika valid, isAdmin akan memeriksa rolenya 'admin' atau bukan.
// // Jika keduanya lolos, baru request akan diteruskan ke controller.
// router.post('/', verifyToken, isAdmin, VocabularyController.create);
// router.put('/:id', verifyToken, isAdmin, VocabularyController.update); // Asumsikan Anda sudah buat controller update
// router.delete('/:id', verifyToken, isAdmin, VocabularyController.remove); // Asumsikan Anda sudah buat controller remove

// export default router;