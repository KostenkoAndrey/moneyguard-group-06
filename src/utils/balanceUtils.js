import createHttpError from 'http-errors';

export const updateBalanceOnCreate = (user, amount, type) => {
  if (amount < 0)
    throw createHttpError(400, 'Amount must be a positive number');

  if (type === 'income') {
    user.balance += amount;
  } else if (type === 'expenses') {
    user.balance -= amount;
  } else {
    throw createHttpError(400, 'Invalid transaction type');
  }
};

export const updateBalanceOnDelete = (user, transaction) => {
  if (transaction.type === 'income') {
    user.balance -= transaction.sum;
  } else if (transaction.type === 'expenses') {
    user.balance += transaction.sum;
  }
};

export const updateBalanceOnUpdate = (user, transaction, newAmount) => {
  const oldAmount = transaction.sum;
  const updatedAmount = newAmount || oldAmount;
  if (updatedAmount < 0)
    throw createHttpError(400, 'Amount must be a positive number');

  if (transaction.type === 'income') {
    user.balance -= oldAmount;
    user.balance += updatedAmount;
  } else if (transaction.type === 'expenses') {
    user.balance += oldAmount;
    user.balance -= updatedAmount;
  } else {
    throw createHttpError(400, 'Invalid transaction type');
  }
};
