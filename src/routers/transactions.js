import { Router } from "express";
import { getTransactionsController, getTransactionByIdController } from '../controllers/transactions.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';

const router = Router();

router.get('/', ctrlWrapper(getTransactionsController));
router.get('/:transactionId', ctrlWrapper(getTransactionByIdController));

export default router;
