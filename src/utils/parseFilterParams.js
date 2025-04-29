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

const parseDate = (value) => {
  if (typeof value !== 'string' || value.trim() === '') return null;
  const parsed = new Date(value.trim());
  return isNaN(parsed.getTime()) ? null : parsed;
};

export const parseFilterParams = (query) => {
  const { type, category, minSum, maxSum, startDate, endDate } = query;

  const parsedType = parseType(type);
  const parsedCategory = parseCategory(category);
  const parsedMinSum = parseNumber(minSum);
  const parsedMaxSum = parseNumber(maxSum);
  const parsedStartDate = parseDate(startDate);
  const parsedEndDate = parseDate(endDate);

  return {
    type: parsedType,
    category: parsedCategory,
    minSum: parsedMinSum,
    maxSum: parsedMaxSum,
    startDate: parsedStartDate,
    endDate: parsedEndDate,
  };
};
