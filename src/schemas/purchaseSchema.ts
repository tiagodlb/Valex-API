import joi from 'joi';

export const purchaseSchema = joi.object({
    password: joi.string().required(),
    businessId: joi.number().required(),
    amount: joi.number().min(1).required()
});

export const onlinePurchaseSchema = joi.object({
    name: joi.string().required(),
    expirationDate: joi.string().length(5).required(),
    cardNumber: joi.string().required(),
    businessId: joi.number().required(),
    amount: joi.number().min(1).required()
});