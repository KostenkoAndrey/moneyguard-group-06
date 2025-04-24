import path from 'path';
export const SORT_ORDER = { ASC: 'asc', DESC: 'desc' };
export const KEYS_OF_TRANSACTION = [ '_id', 'type', 'category', 'summ', 'comments', 'date' ];
export const ALLOWED_CATEGORIES = [ 'main expenses', 'products', 'car', 'self care', 'child care', 'household products', 'education', 'leisure', 'entertainment', 'other expenses' ];
export const ALLOWED_TYPES = ['+', '-'];
export const SWAGGER_PATH = path.join(process.cwd(), 'docs', 'swagger.json');
