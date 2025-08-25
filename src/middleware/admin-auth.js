import { statusCodes } from '../utils/http.js';
import { errorCodes } from '../utils/error-codes.js';

export function requireAdmin(req, res, next) {
    if (!req.user) {
        return res.status(statusCodes.UNAUTHORIZED).json({
            code: errorCodes.UNAUTHORIZED,
            message: 'Authentication required'
        });
    }

    if (req.user.role !== 'ADMIN') {
        return res.status(statusCodes.FORBIDDEN).json({
            code: errorCodes.FORBIDDEN,
            message: 'Admin privileges required'
        });
    }

    next();
}
