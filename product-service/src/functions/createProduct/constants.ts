import Joi from 'joi';

export const SCHEMA = Joi.object({
    title: Joi.string().required(),
    price: Joi.number().required(),
    count: Joi.number().required(),
    description: Joi.string().required()
});
