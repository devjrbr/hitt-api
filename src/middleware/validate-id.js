import { statusCodes } from '../utils/http.js';
import { createErrorResponse, errorCodes } from '../utils/error-codes.js';

export function validateId(req, res, next) {
    const { id } = req.params;
    
    if (!id || isNaN(parseInt(id))) {
        return res.status(statusCodes.BAD_REQUEST).json(
            createErrorResponse(errorCodes.INVALID_ID, 'Invalid ID parameter', 'id')
        );
    }
    
    next();
}
