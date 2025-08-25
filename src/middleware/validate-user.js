import Joi from 'joi';
import { cpf } from 'cpf-cnpj-validator';
import { createValidationErrorResponse } from '../utils/error-codes.js';

const userSchema = Joi.object({
    type: Joi.string().valid('STARTUP', 'PARTNER', 'VISITOR').required(),
    registration_code: Joi.string().optional().allow(''),
    full_name: Joi.string().required(),
    email: Joi.string().email().required(),
    phone: Joi.string().required(),
    cpf: Joi.string().required().custom((value, helpers) => {
        if (!cpf.isValid(value)) {
            return helpers.message('Invalid CPF');
        }
        return value;
    }),
    birth_date: Joi.date().iso().required(),
    gender: Joi.string().valid('MALE', 'FEMALE', 'NOT_INFORMED').required(),
    how_did_you_know: Joi.string().required(),
    newsletter: Joi.boolean().required(),
});

export function validateUser(req, res, next) {
    const { error } = userSchema.validate(req.body, { abortEarly: false });
    if (error) {
        return res.status(400).json(createValidationErrorResponse(error.details));
    }
    next();
}
