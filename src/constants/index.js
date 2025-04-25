import path from 'path';

export const SWAGGER_PATH = path.join(process.cwd(), 'docs', 'swagger.json');
export const SORT_ORDER = { ASC: 'asc', DESC: 'desc' };
export const KEYS_OF_TRANSACTION = [ '_id', 'type', 'category', 'sum', 'comment', 'date' ];
export const ALLOWED_CATEGORIES = [ 'income', 'main expenses', 'products', 'car', 'self care', 'child care', 'household products', 'education', 'leisure', 'entertainment', 'other expenses' ];
export const ALLOWED_TYPES = ['income', 'expenses'];
