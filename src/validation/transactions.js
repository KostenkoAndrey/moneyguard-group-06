import Joi from 'joi';

export const createTransactionSchema = Joi.object({
    type: Joi.string().valid('+', '-').required(),
    category: Joi.string()
            .valid(
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
    summ: Joi.number().min(0).required(),
    comments: Joi.string().allow(''),
    date: Joi.date().required()
});

export const updateTransactionSchema = Joi.object({
    type: Joi.string().valid('+', '-'),
    category: Joi.string()
            .valid(
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
    summ: Joi.number().min(0),
    comments: Joi.string().allow(''),
    date: Joi.date()
});
