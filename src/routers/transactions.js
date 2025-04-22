import { Router } from "express";

import {
    getTransactionsController,
    getTransactionByIdController,
    createTransactionController,
    deleteTransactionController,
    upsertTransactionController,
    patchTransactionController
} from '../controllers/transactions.js';
import { validateBody } from '../middlewares/validateBody.js';
import { isValidId } from '../middlewares/isValidId.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { createTransactionSchema, updateTransactionSchema } from '../validation/transactions.js';


const router = Router();

router.get('/', ctrlWrapper(getTransactionsController));
router.get('/:transactionId', isValidId, ctrlWrapper(getTransactionByIdController));
router.post('/', validateBody(createTransactionSchema), ctrlWrapper(createTransactionController));
router.delete('/:transactionId', isValidId, ctrlWrapper(deleteTransactionController));
router.put('/:transactionId', isValidId, validateBody(createTransactionSchema), ctrlWrapper(upsertTransactionController));
router.patch('/:transactionId', isValidId, validateBody(updateTransactionSchema), ctrlWrapper(patchTransactionController));


export default router;
