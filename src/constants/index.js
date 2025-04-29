import path from 'path';
export const SWAGGER_PATH = path.join(process.cwd(), 'docs', 'swagger.json');
export const TEMP_UPLOAD_DIR = path.join(process.cwd(), 'temp');
export const UPLOAD_DIR = path.join(process.cwd(), 'uploads');

export const SORT_ORDER = { ASC: 'asc', DESC: 'desc' };
export const KEYS_OF_TRANSACTION = [
  '_id',
  'type',
  'category',
  'sum',
  'comment',
  'date',
];
export const ALLOWED_CATEGORIES = [
  'income',
  'main expenses',
  'products',
  'car',
  'self care',
  'child care',
  'household products',
  'education',
  'leisure',
  'entertainment',
  'other expenses',
];
export const ALLOWED_TYPES = ['income', 'expenses'];
export const CLOUDINARY = { CLOUD_NAME: 'CLOUD_NAME', API_KEY: 'API_KEY', API_SECRET: 'API_SECRET' };
export const ONE_DAY = 24 * 60 * 60 * 1000;
export const THIRTY_DAY = 24 * 60 * 60 * 1000;
