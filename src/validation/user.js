import Joi from "joi";

export const registerSchema = Joi.object({
    name: Joi.string().min(3).max(20).required(),
    email: Joi.string().min(3).max(22).email().required(),
    password: Joi.string().min(3).max(20).required(),
    balance: Joi.number().default(0),
    createdAt: Joi.date().default(Date.now()),
    updateAt: Joi.date().default(Date.now()),

});

export const updateUserSchema = Joi.object({
    name: Joi.string().min(3).max(20),
    photo: Joi.string().allow('', null).optional(),
    // email: Joi.string().min(3).max(22).email(),
    // password: Joi.string().min(3).max(20),
    // balance: Joi.number().default(0),
});

export const loginSchema = Joi.object({
    email: Joi.string().min(3).max(22).email().required(),
    password: Joi.string().min(3).max(20).required(),
});

export const requestPasswordResetSchema = Joi.object({
    email: Joi.string().min(3).email().required(),
});

export const resetPasewordSchema = Joi.object({
    token: Joi.string().required(),
    password: Joi.string().min(3).required(),
});

export const confirmOAuthSchema = Joi.object({
    code: Joi.string().required(),
});
