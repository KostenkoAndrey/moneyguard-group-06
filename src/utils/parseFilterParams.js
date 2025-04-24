import { ALLOWED_CATEGORIES, ALLOWED_TYPES } from "../constants/index.js";

const parseCategoryOrType = (value) => {
if (typeof value !== 'string' || value.trim() === '') return;
if (ALLOWED_CATEGORIES.includes(value)) return value;
if (ALLOWED_TYPES.includes(value)) return value;
};

const parseNumber = (number) => {
if (typeof number !== 'string' || number.trim() === '') return;
const parsedNumber = parseFloat(number);
if (Number.isNaN(parsedNumber)) return;
return parsedNumber;
};

export const parseFilterParams = (query) => {
const { type, category, summ, comments, date } = query;

const parsedType = parseCategoryOrType(type);
const parsedCategory = parseCategoryOrType(category);
const parsedNumber = parseNumber(summ);

return {
    type: parsedType,
    category: parsedCategory,
    summ: parsedNumber
    };
};
