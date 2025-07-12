import { Router } from 'express';
import * as AuthController from '../controllers/auth.controller';
import { verifyToken } from '../middlewares/auth.middleware';

const router = Router();

router.post('/register', AuthController.register);
router.post('/login', AuthController.login);

router.get('/me', verifyToken, AuthController.getMe);

export default router;