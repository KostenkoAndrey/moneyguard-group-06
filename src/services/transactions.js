import { transactionsCollection } from '../db/models/transactions.js';

export const getAllTransactions = async () => {
  const transaction = await transactionsCollection.find();
  return transaction;
};

export const getTransactionsById = async (transactionId) => {
    console.log(transactionId);

  const transaction = await transactionsCollection.findById(transactionId);
  return transaction;
};
