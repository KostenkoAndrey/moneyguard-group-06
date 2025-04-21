import Joi from "joi";

export const registerSchema = Joi.object({
    name: Joi.string().min(3).max(20).required(),
    email: Joi.string().min(3).max(20).email().required(),
    password: Joi.string().min(3).max(20).required(),
    createdAt: Joi.date().default(Date.now()),
    updateAt: Joi.date().default(Date.now()),

});

export const loginSchema = Joi.object({
    email: Joi.string().min(3).max(20).email().required(),
    password: Joi.string().min(3).max(20).required(),
});

export const requestPasswordResetSchema = Joi.object({
    email: Joi.string().min(3).email().required(),
});

export const resetPaeewordSchema = Joi.object({
    token: Joi.string().required(),
    password: Joi.string().min(3).required(),
});

export const confirmOAuthSchema = Joi.object({
    code: Joi.string().required(),
});