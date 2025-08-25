import Joi from 'joi';
import { createValidationErrorResponse } from '../utils/error-codes.js';
import { statusCodes } from '../utils/http.js';

const authRequestSchema = Joi.object({
    email: Joi.string().email().required().messages({
        'string.email': 'Invalid email format',
        'any.required': 'Email is required'
    })
});

const authCodeSchema = Joi.object({
    email: Joi.string().email().required().messages({
        'string.email': 'Invalid email format',
        'any.required': 'Email is required'
    }),
    code: Joi.string().length(6).pattern(/^\d+$/).required().messages({
        'string.length': 'Code must be 6 digits',
        'string.pattern.base': 'Code must contain only numbers',
        'any.required': 'Code is required'
    })
});

export function validateAuthRequest(req, res, next) {
    const { error } = authRequestSchema.validate(req.body, { abortEarly: false });
    
    if (error) {
        return res.status(statusCodes.BAD_REQUEST).json(
            createValidationErrorResponse(error.details)
        );
    }
    
    next();
}

export function validateAuthCode(req, res, next) {
    const { error } = authCodeSchema.validate(req.body, { abortEarly: false });
    
    if (error) {
        return res.status(statusCodes.BAD_REQUEST).json(
            createValidationErrorResponse(error.details)
        );
    }
    
    next();
}
