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
  const { sum, type } = transaction;

  if (sum < 0) {
    throw createHttpError(400, 'Transaction sum must be a positive number');
  }

  if (type === 'income') {
    user.balance -= sum;
  } else if (type === 'expenses') {
    user.balance += sum;
  } else {
    throw createHttpError(400, 'Invalid transaction type');
  }
};

export const updateBalanceOnUpdate = (user, transaction, newAmount) => {
  const oldAmount = transaction.sum;
  const updatedAmount = newAmount ?? oldAmount;

  if (updatedAmount < 0) {
    throw createHttpError(400, 'Amount must be a positive number');
  }

  if (transaction.type === 'income') {
    const tempBalance = user.balance - oldAmount + updatedAmount;
    user.balance = tempBalance;
  } else if (transaction.type === 'expenses') {
    const tempBalance = user.balance + oldAmount - updatedAmount;
    user.balance = tempBalance;
  } else {
    throw createHttpError(400, 'Invalid transaction type');
  }
};
