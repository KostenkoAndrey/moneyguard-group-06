import { getAllTransactions, getTransactionsById } from '../services/transactions.js';
import createHttpError from 'http-errors';

export const getTransactionsController = async (req, res) => {
    const transactions = await getAllTransactions();

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
