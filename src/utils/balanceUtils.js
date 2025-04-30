import createHttpError from 'http-errors';

export const updateBalanceOnCreate = (user, amount, type) => {
  if (amount < 0)
    throw createHttpError(400, 'Amount must be a positive number');

  if (type === 'income') {
    user.balance += amount;
  } else if (type === 'expenses') {
    if (user.balance < amount) {
      throw createHttpError(400, 'Insufficient balance for this expense');
    }
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
    if (user.balance < sum) {
      throw createHttpError(
        400,
        'Cannot delete income transaction: insufficient balance',
      );
    }
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
    if (tempBalance < 0) {
      throw createHttpError(
        400,
        'Insufficient balance for updating this income transaction',
      );
    }
    user.balance = tempBalance;
  } else if (transaction.type === 'expenses') {
    // Откатываем старый расход и применяем новый
    const tempBalance = user.balance + oldAmount - updatedAmount;
    if (tempBalance < 0) {
      throw createHttpError(
        400,
        'Insufficient balance for updating this expense transaction',
      );
    }
    user.balance = tempBalance;
  } else {
    throw createHttpError(400, 'Invalid transaction type');
  }
};
