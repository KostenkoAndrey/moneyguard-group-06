const allowedCategories = [
    'main expenses',
    'products',
    'car',
    'self care',
    'child care',
    'household products',
    'education',
    'leisure',
    'entertainment',
    'other expenses'
];

const allowedTypes = ['+', '-'];

const parseCategoryOrType = (value) => {
if (typeof value !== 'string' || value.trim() === '') return;
if (allowedCategories.includes(value)) return value;
if (allowedTypes.includes(value)) return value;
};

const parseNumber = (number) => {
if (typeof number !== 'string' || number.trim() === '') return;
const parsedNumber = parseFloat(number);
if (Number.isNaN(parsedNumber)) return;
return parsedNumber;
};

export const parseFilterParams = (query) => {
    const { type, category, summ, comments, date } = query;

    const parsedCategory = parseCategoryOrType(category);
    const parsedType = parseCategoryOrType(type);
    const parsedNumber = parseNumber(summ);

    return {
        category: parsedCategory,
        type: parsedType,
        summ: parsedNumber
    };
};
