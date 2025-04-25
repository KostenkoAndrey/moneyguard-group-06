import { SORT_ORDER, KEYS_OF_TRANSACTION } from "../constants/index.js";

const parseSortOrder = (sortOrder) => {
const isKnownOrder = [SORT_ORDER.ASC, SORT_ORDER.DESC].includes(sortOrder);
if (isKnownOrder) return sortOrder;
return SORT_ORDER.ASC;
};

const parseSortBy = (sortBy) => {
if (KEYS_OF_TRANSACTION.includes(sortBy)) return sortBy;
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
