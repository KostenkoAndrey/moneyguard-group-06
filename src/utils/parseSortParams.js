import { SORT_ORDER } from "../constants/index.js";

const parseSortOrder = (sortOrder) => {
const isKnownOrder = [SORT_ORDER.ASC, SORT_ORDER.DESC].includes(sortOrder);
if (isKnownOrder) return sortOrder;
return SORT_ORDER.ASC;
};

const parseSortBy = (sortBy) => {
const keysOfStudent = [
    '_id',
    'type',
    'category',
    'summ',
    'comments',
    'date',
    'createdAt',
    'updatedAt'
];

if (keysOfStudent.includes(sortBy)) return sortBy;

return '_id';
};

export const parseSortParams = (query) => {
const { sortOrder, sortBy } = query;

const parsedSortOrder = parseSortOrder(sortOrder);
const parsedSortBy = parseSortBy(sortBy);

return {
sortOrder: parsedSortOrder,
sortBy: parsedSortBy,
};
};
