import createHttpError from 'http-errors';

import {
  getAllTransactions,
  getTransactionsById,
  createTransaction,
  deleteTransaction,
  updateTransaction,
  summaryByCategories,
  summaryByDate,
} from '../services/transactions.js';
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
  const transaction = await getTransactionsById(transactionId, req.user.id);

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

export const deleteTransactionController = async (req, res, next) => {
  const { transactionId } = req.params;

  const transaction = await deleteTransaction(transactionId, req.user.id);


  if (!transaction) return next(createHttpError(404, 'Transaction not found'));

  res.status(200).json({
    status: 200,
    message: `Successfully deleted transaction!`,
    data: transaction,
  });
};

export const upsertTransactionController = async (req, res, next) => {
  const { transactionId } = req.params;
  const filter = { _id: transactionId, userId: req.user.id };

  const result = await updateTransaction(filter, req.body, { upsert: true });

  if (!result) return next(createHttpError(404, 'Transaction not found'));

  const status = result.isNew ? 201 : 200;

  res.status(status).json({
    status,
    message: `Successfully upserted a transaction!`,
    data: result.transaction,
  });
};

export const patchTransactionController = async (req, res, next) => {
  const { transactionId } = req.params;
  const filter = { _id: transactionId, userId: req.user.id };
  const result = await updateTransaction(filter, req.body, { upsert: true });

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

export const categoriesController = async (req, res, next) => {
  const categories = await summaryByCategories(req.user.id);

  res.json({
    status: 200,
    message: `Successfully found categories and their total sums!`,
    data: categories,
  });
};

export const summaryController = async (req, res, next) => {
  const { yearMonth } = req.params;
  const [year, month] = yearMonth.split('-').map(Number);
  const monthTwoDigits = month.toString().padStart(2, '0');

  if (!year || !month || month < 1 || month > 12) {
    return res.status(400).json({ error: 'Invalid date format. Use YYYY-MM' });
  }

  const summary = await summaryByDate(
    year,
    monthTwoDigits,
    req.user.id,
  );

  res.json({
    status: 200,
    message: `Successfully found categories and their total sums!`,
    data: {
      "date": yearMonth,
      ...summary,
    },
  });
};
