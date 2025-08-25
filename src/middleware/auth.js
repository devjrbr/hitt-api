import { verifyJWT } from '../utils/jwt.js';
import { statusCodes } from '../utils/http.js';
import { createErrorResponse, errorCodes } from '../utils/error-codes.js';

export function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.replace('Bearer', '').trim();

    if (!token) {
        return res.status(statusCodes.BAD_REQUEST).json({
            code: errorCodes.TOKEN_REQUIRED,
            message: 'Access token is required'
        });
    }

    const decoded = verifyJWT(token);
    
    if (!decoded) {
        return res.status(statusCodes.BAD_REQUEST).json({
            code: errorCodes.INVALID_TOKEN,
            message: 'Invalid or expired token'
        });
    }

    req.user = decoded;
    next();
}
