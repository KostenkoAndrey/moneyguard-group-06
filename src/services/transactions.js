import { SORT_ORDER } from '../constants/index.js';
import { transactionsCollection } from '../db/models/transactions.js';
import { User } from '../db/models/user.js';
import { calculatePaginationData } from '../utils/calculatePaginationData.js';
import { validateTransactionPayload } from '../utils/validateTransactionPayload.js';
import {
  updateBalanceOnCreate,
  updateBalanceOnDelete,
  updateBalanceOnUpdate,
} from '../utils/balanceUtils.js';
import { totalExspensesIncome } from '../utils/totalExspensesIncome.js';

export const getAllTransactions = async ({
  page,
  perPage,
  sortOrder = SORT_ORDER.ASC,
  sortBy = '_id',
  filter = {},
  userId,
}) => {
  const limit = perPage;
  const skip = (page - 1) * perPage;

  const queryObject = { userId };

  if (filter.type) {
    queryObject.type = filter.type;
  }

  if (filter.category) {
    queryObject.category = filter.category;
  }

  if (filter.minSum || filter.maxSum) {
    queryObject.sum = {};
    if (filter.minSum) queryObject.sum.$gte = filter.minSum;
    if (filter.maxSum) queryObject.sum.$lte = filter.maxSum;
  }

  if (filter.startDate || filter.endDate) {
    queryObject.date = {};
    if (filter.startDate) queryObject.date.$gte = filter.startDate;
    if (filter.endDate) queryObject.date.$lte = filter.endDate;
  }
console.log(filter);

  const [transactionsCount, transactions] = await Promise.all([
    transactionsCollection.find(queryObject).countDocuments(),
    transactionsCollection
      .find(queryObject)
      .skip(skip)
      .limit(limit)
      .sort({ [sortBy]: sortOrder })
      .exec(),
  ]);

  const paginationData = calculatePaginationData(
    transactionsCount,
    perPage,
    page,
  );

  return {
    data: transactions,
    ...paginationData,
  };
};

export const getTransactionsById = async (transactionId, userId) => {
  const transaction = await transactionsCollection.findById({
    _id: transactionId,
    userId,
  });
  return transaction;
};

export const createTransaction = async (payload, userId) => {
  validateTransactionPayload(payload);
  const user = await User.findById(userId);

  updateBalanceOnCreate(user, payload.sum, payload.type);
  const transaction = await transactionsCollection.create({
    ...payload,
    userId,
  });
  await user.save();

  return transaction;
};

export const deleteTransaction = async (transactionId, userId) => {
  const user = await User.findById(userId);
  const transaction = await transactionsCollection.findOneAndDelete({
    _id: transactionId,
    userId,
  });
  if (!transaction || !user) return null;

  updateBalanceOnDelete(user, transaction);
  await user.save();

  return transaction;
};

export const updateTransaction = async (filter, payload, options = {}) => {
  validateTransactionPayload(payload);
  const user = await User.findById(filter.userId);
  const transaction = await transactionsCollection.findOne(filter);
  if (!transaction || !user) return null;

  updateBalanceOnUpdate(user, transaction, payload.sum);

  const rawResult = await transactionsCollection.findOneAndUpdate(
    filter,
    payload,
    { new: true, includeResultMetadata: true, ...options },
  );

  if (!rawResult || !rawResult.value) return null;
  await user.save();

  return {
    transaction: rawResult.value,
    isNew: Boolean(rawResult?.lastErrorObject?.upserted),
  };
};

export const summaryByCategories = async (id) => {
  const transactions = await transactionsCollection.find({ userId: id });
  const total = totalExspensesIncome(transactions);

  return total;
};

export const summaryByDate = async (year, month, id) => {
  const startDate = new Date(`${year}-${month}-01T00:00:00.000Z`);
  const endDate = new Date(startDate);
  endDate.setMonth(startDate.getMonth() + 1);

  const transactions = await transactionsCollection.aggregate([
    {
      $match: {
        userId: id,
        date: { $gte: startDate, $lt: endDate },
      },
    },
  ]);

  const total = totalExspensesIncome(transactions);

  return total;
};
