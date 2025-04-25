import createHttpError from 'http-errors';

import { getAllTransactions, getTransactionsById, createTransaction, deleteTransaction, updateTransaction } from '../services/transactions.js';
import { parsePaginationParams } from '../utils/parsePaginationParams.js';
import { parseSortParams } from '../utils/parseSortParams.js';
import { parseFilterParams } from '../utils/parseFilterParams.js';

//** get all transactions   */
export const getTransactionsController = async (req, res) => {
    const { page, perPage } = parsePaginationParams(req.query);
    const { sortBy, sortOrder } = parseSortParams(req.query);
    const filter = parseFilterParams(req.query);

    const transactions = await getAllTransactions({
        page,
        perPage,
        sortBy,
        sortOrder,
        filter,
        userId: req.user.id,
    });

    res.json({
        status: 200,
        message: 'Successfully found transactions!',
        data: transactions,
    });
};


export const getTransactionByIdController = async (req, res, next) => {
    const { transactionId } = req.params;
    const transaction = await getTransactionsById( transactionId, req.user.id );

    if (!transaction) throw createHttpError(404, 'Transaction not found');

    res.json({
        status: 200,
        message: `Successfully found transaction with id ${transactionId}!`,
        data: transaction,
    });
};


export const createTransactionController = async (req, res) => {
    const transaction = await createTransaction(req.body, req.user.id);

    res.status(201).json({
        status: 201,
        message: `Successfully created a transaction!`,
        data: transaction,
    });
};


//** delete transaction   */
export const deleteTransactionController = async (req, res, next) => {
    const { transactionId } = req.params;

    const transaction = await deleteTransaction( transactionId, req.user.id);

    if (!transaction) return next(createHttpError(404, 'Transaction not found'));

    res.status(204).send();
};


//** upsert transaction   */
export const upsertTransactionController = async (req, res, next) => {
const { transactionId } = req.params;
const filter = { _id: transactionId, userId: req.user.id };

const result = await updateTransaction( filter, req.body, { upsert: true });

if (!result) return next(createHttpError(404, 'Transaction not found'));

const status = result.isNew ? 201 : 200;

    res.status(status).json({
        status,
        message: `Successfully upserted a transaction!`,
        data: result.transaction,
    });
};


//** patch transaction   */
export const patchTransactionController = async (req, res, next) => {
const { transactionId } = req.params;
const filter = { _id: transactionId, userId: req.user.id };
const result = await updateTransaction( filter, req.body, { upsert: true });

    if (!result) {
        next(createHttpError(404, 'Transaction not found'));
        return;
    }

    res.json({
        status: 200,
        message: `Successfully patched a transaction!`,
        data: result.transaction,
    });
};
