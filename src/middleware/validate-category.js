import Joi from 'joi';
import { createValidationErrorResponse } from '../utils/error-codes.js';

const categorySchema = Joi.object({
    name: Joi.string().min(2).max(50).required().messages({
        'string.min': 'Category name must be at least 2 characters',
        'string.max': 'Category name must not exceed 50 characters',
        'any.required': 'Category name is required'
    })
});

export function validateCategory(req, res, next) {
    const { error } = categorySchema.validate(req.body, { abortEarly: false });
    if (error) {
        return res.status(400).json(createValidationErrorResponse(error.details));
    }
    next();
}
