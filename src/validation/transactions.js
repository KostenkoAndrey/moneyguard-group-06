import Joi from 'joi';

export const createTransactionSchema = Joi.object({
    type: Joi.string().valid('+', '-').required(),
    category: Joi.string()
        .valid(
            'main expenses',
            'products',
            'car',
            'Self care',
            'Child care',
            'Household products',
            'Education',
            'Leisure',
            'Entertainment',
            'Other expenses'
        ).required(),
    summ: Joi.number().min(0).required(),
    comments: Joi.string().allow(''),
    date: Joi.date().required(),
    userId: Joi.string().required()
});

export const updateTransactionSchema = Joi.object({
    type: Joi.string().valid('+', '-'),
    category: Joi.string()
        .valid(
            'main expenses',
            'products',
            'car',
            'Self care',
            'Child care',
            'Household products',
            'Education',
            'Leisure',
            'Entertainment',
            'Other expenses'
        ),
    summ: Joi.number().min(0),
    comments: Joi.string().allow(''),
    date: Joi.date()
});
