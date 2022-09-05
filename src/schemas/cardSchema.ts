import joi from "joi";

export const cardSchema = joi.object({
  employeeId: joi.number().required(),
  type: joi
    .string()
    .valid("groceries", "restaurant", "transport", "education", "health")
    .required(),
});

export const activationCardSchema = joi.object({
  securityCode: joi.string().length(3).required(),
  password: joi.string().length(4).required(),
  originalCardId: joi.number().required(),
});

export const blockCardSchema = joi.object({
    cardId: joi.number().required(),
    password: joi.string().length(4).required(),
  });
  