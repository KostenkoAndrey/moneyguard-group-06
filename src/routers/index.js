import { Router } from 'express';
import transactionsRouter from './transactions.js';
import authRouter from './auth.js';
import { authenticate } from '../middlewares/authenticate.js';

const router = Router();

router.use('/auth', authRouter);
router.use('/transactions', authenticate, transactionsRouter);

export default router;
