import { Router } from 'express';
import transactionsRouter from './transactions.js';

const router = Router();

router.use('/transactions', transactionsRouter);
// router.use('/auth', authRouter);

export default router;
