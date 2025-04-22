import { transactionsCollection } from '../db/models/transactions.js';
import { calculatePaginationData } from '../utils/calculatePaginationData.js';
import { SORT_ORDER } from '../constants/index.js';


export const getAllTransactions = async ({
  page,
  perPage,
  sortOrder = SORT_ORDER.ASC,
  sortBy = '_id',
  filter = {},
  }) => {

  const limit = perPage;
  const skip = (page - 1) * perPage;
  const transactionsQuery = transactionsCollection.find();

  if (filter.type) {
    transactionsQuery.where('type').equals(filter.type);
  }

  if (filter.category) {
    transactionsQuery.where('category').equals(filter.category);
  }

  const [ transactionsCount, transactions ] = await Promise.all([
  transactionsCollection.find().merge(transactionsQuery).countDocuments(),
  transactionsQuery.skip(skip).limit(limit).sort({ [sortBy]: sortOrder }).exec()]);


  const paginationData = calculatePaginationData(transactionsCount, perPage, page);

  return {
    data: transactions,
    ...paginationData,
  };
};


export const getTransactionsById = async (transactionId) => {
    console.log(transactionId);

  const transaction = await transactionsCollection.findById(transactionId);
  return transaction;
};


export const createTransaction = async (payload) => {
  const transaction = await transactionsCollection.create(payload);
  return transaction;
};


export const deleteTransaction = async (transactionId) => {
  const transaction = await transactionsCollection.findOneAndDelete({
    _id: transactionId,
  });

  return transaction;
};

export const updateTransaction = async (transactionId, payload, options = {}) => {
  const rawResult = await transactionsCollection.findOneAndUpdate(
    { _id: transactionId },
    payload,
    {
      new: true,
      includeResultMetadata: true,
      ...options,
    },
  );

  if (!rawResult || !rawResult.value) return null;

  return {
    transaction: rawResult.value,
    isNew: Boolean(rawResult?.lastErrorObject?.upserted),
  };
};
