import { Router } from 'express';
import transactionsRouter from './transactions.js';
import authRouter from './auth.js';
import { authenticate } from '../middlewares/authenticate.js';
import userRouter from './user.js';

const router = Router();

router.use('/auth', authRouter);
router.use('/transactions', authenticate, transactionsRouter);
router.use('/', userRouter);

export default router;
