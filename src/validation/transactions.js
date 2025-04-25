import Joi from 'joi';

export const createTransactionSchema = Joi.object({
    type: Joi.string().valid('income', 'expenses').required(),
    category: Joi.string()
            .valid(
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
            'other expenses'
            ).required(),
    sum: Joi.number().min(0).required(),
    comment: Joi.string().allow(''),
    date: Joi.date().required(),
});

export const updateTransactionSchema = Joi.object({
    type: Joi.string().valid('income', 'expenses').required(),
    category: Joi.string()
            .valid(
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
            'other expenses'
            ),
    sum: Joi.number().min(0),
    comment: Joi.string().allow(''),
    date: Joi.date(),
});
