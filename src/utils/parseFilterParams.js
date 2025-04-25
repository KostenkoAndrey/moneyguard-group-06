import { ALLOWED_CATEGORIES, ALLOWED_TYPES } from '../constants/index.js';

const parseType = (value) => {
  if (typeof value !== 'string' || value.trim() === '') return;
  const normalized = value.trim().toLowerCase();
  if (ALLOWED_TYPES.includes(normalized)) return normalized;
};

const parseCategory = (value) => {
  if (typeof value !== 'string' || value.trim() === '') return;
  const normalized = value.trim().toLowerCase();
  if (ALLOWED_CATEGORIES.includes(normalized)) return normalized;
};

const parseNumber = (number) => {
  if (typeof number !== 'string' || number.trim() === '') return;
  const parsedNumber = parseFloat(number);
  if (Number.isNaN(parsedNumber)) return;
  return parsedNumber;
};

export const parseFilterParams = (query) => {
  const { type, category, minSum, maxSum } = query;

  const parsedType = parseType(type);
  const parsedCategory = parseCategory(category);
  const parsedMinSum = parseNumber(minSum);
  const parsedMaxSum = parseNumber(maxSum);

  return {
    type: parsedType,
    category: parsedCategory,
    minSum: parsedMinSum,
    maxSum: parsedMaxSum,
  };
};
