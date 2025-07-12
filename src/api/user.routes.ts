import { Router } from 'express';
import * as UserController from '../controllers/user.controller';
import { verifyToken } from '../middlewares/auth.middleware';

const router = Router();

router.put('/me', verifyToken, UserController.updateCurrentUser);
router.delete('/me', verifyToken, UserController.deleteCurrentUser);

export default router;