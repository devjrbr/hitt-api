import { verifyJWT } from '../utils/jwt.js';
import { statusCodes } from '../utils/http.js';
import { createErrorResponse, errorCodes } from '../utils/error-codes.js';

export function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(statusCodes.BAD_REQUEST).json(
            createErrorResponse(errorCodes.TOKEN_REQUIRED, 'Access token is required')
        );
    }

    const decoded = verifyJWT(token);
    
    if (!decoded) {
        return res.status(statusCodes.BAD_REQUEST).json(
            createErrorResponse(errorCodes.INVALID_TOKEN, 'Invalid or expired token')
        );
    }

    req.user = decoded;
    next();
}
