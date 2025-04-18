import createHttpError from 'http-errors';

import { getAllTransactions, getTransactionsById, createTransaction, deleteTransaction, updateTransaction } from '../services/transactions.js';
import { parsePaginationParams } from '../utils/parsePaginationParams.js';
import { parseSortParams } from '../utils/parseSortParams.js';
import { parseFilterParams } from '../utils/parseFilterParams.js';


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
});

    res.json({
        status: 200,
        message: 'Successfully found transactions!',
        data: transactions,
    });
};


export const getTransactionByIdController = async (req, res, next) => {
    const { transactionId } = req.params;
    const transaction = await getTransactionsById(transactionId);

    if (!transaction) throw createHttpError(404, 'Transaction not found');

    res.json({
        status: 200,
        message: `Successfully found transaction with id ${transactionId}!`,
        data: transaction,
    });
};

export const createTransactionController = async (req, res) => {
    const transaction = await createTransaction(req.body);

    res.status(201).json({
        status: 201,
        message: `Successfully created a transaction!`,
        data: transaction,
});
};


export const deleteTransactionController = async (req, res, next) => {
const { transactionId } = req.params;

const transaction = await deleteTransaction(transactionId);

if (!transaction) {
    next(createHttpError(404, 'Transaction not found'));
    return;
}

    res.status(204).send();
};


export const upsertTransactionController = async (req, res, next) => {
    const { transactionId } = req.params;
    const result = await updateTransaction(transactionId, req.body, {
        upsert: true,
    });

    if (!result) {
        next(createHttpError(404, 'Transaction not found'));
        return;
    }

    const status = result.isNew ? 201 : 200;

        res.status(status).json({
            status,
            message: `Successfully upserted a transaction!`,
            data: result.transaction,
    });
};


export const patchTransactionController = async (req, res, next) => {
const { transactionId } = req.params;
const result = await updateTransaction(transactionId, req.body);

if (!result) {
    next(createHttpError(404, 'Transaction not found'));
    return;
}

    res.json({
        status: 200,
        message: `Successfully patched a transaction!`,
        data: result.student,
});
};
