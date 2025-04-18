const parseCategoryOrType = (categoryOrType) => {
const isString = typeof categoryOrType === 'string';
if (!isString) return;

const isCategory = (categoryOrType) => [
        'main expenses',
        'products',
        'car',
        'self care',
        'child care',
        'household products',
        'education',
        'leisure',
        'entertainment',
        'other expenses'].includes(categoryOrType);

const isType = (categoryOrType) => [ '+', '-' ].includes(categoryOrType);

if (isCategory(categoryOrType)) return categoryOrType;
if (isType(categoryOrType)) return categoryOrType;
};

const parseNumber = (number) => {
    const isString = typeof number === 'string';
    if (!isString) return;

    const parsedNumber = parseInt(number);
    if (Number.isNaN(parsedNumber)) {
    return;
    }

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
