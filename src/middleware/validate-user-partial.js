import Joi from 'joi';
import { cpf } from 'cpf-cnpj-validator';
import { createValidationErrorResponse } from '../utils/error-codes.js';

const userPartialSchema = Joi.object({
    type: Joi.string().valid('STARTUP', 'PARTNER', 'VISITOR').optional(),
    registration_code: Joi.string().optional().allow(''),
    full_name: Joi.string().optional(),
    email: Joi.string().email().optional(),
    phone: Joi.string().optional(),
    cpf: Joi.string().optional().custom((value, helpers) => {
        if (!cpf.isValid(value)) {
            return helpers.message('Invalid CPF');
        }
        return value;
    }),
    birth_date: Joi.date().iso().optional(),
    gender: Joi.string().valid('MALE', 'FEMALE', 'NOT_INFORMED').optional(),
    how_did_you_know: Joi.string().optional(),
    newsletter: Joi.boolean().optional(),
});

export function validateUserPartial(req, res, next) {
    const { error } = userPartialSchema.validate(req.body, { abortEarly: false });
    if (error) {
        return res.status(400).json(createValidationErrorResponse(error.details));
    }
    next();
}
