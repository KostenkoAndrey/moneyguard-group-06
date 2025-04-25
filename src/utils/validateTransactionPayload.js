import createHttpError from 'http-errors';
import { ALLOWED_CATEGORIES } from '../constants/index.js';
const ALLOWED_EXPENSES_CATEGORIES = ALLOWED_CATEGORIES.filter((category) => category !== 'income');

export const validateTransactionPayload = (payload) => {
  if (payload.type === 'income') {
    if (payload.category !== 'income') {
      throw createHttpError(
        400,
        'Category must be "income" when type is "income"',
      );
    }
  } else if (payload.type === 'expenses') {
    if (
      payload.category === 'income' ||
      !ALLOWED_EXPENSES_CATEGORIES.includes(payload.category)
    ) {
      throw createHttpError(
        400,
        'Category must be a valid expense category when type is "expenses"',
      );
    }
  } else {
    throw createHttpError(400, 'Invalid transaction type');
  }

  return true;
};
