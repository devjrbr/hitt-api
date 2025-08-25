import { verifyJWT } from '../utils/jwt.js';
import { findUserById } from '../repository/index.js';
import { statusCodes } from '../utils/http.js';
import { errorCodes } from '../utils/error-codes.js';

export async function authenticateToken(req, res, next) {
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

    try {
        const user = await findUserById(decoded.id);
        
        if (!user) {
            return res.status(statusCodes.UNAUTHORIZED).json({
                code: errorCodes.USER_NOT_FOUND,
                message: 'User not found'
            });
        }

        req.user = user;
        next();
    } catch (error) {
        return res.status(statusCodes.INTERNAL_SERVER_ERROR).json({
            code: errorCodes.INTERNAL_SERVER_ERROR,
            message: 'Failed to authenticate user'
        });
    }
}
