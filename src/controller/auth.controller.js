import { requestLoginCode, verifyLoginCode } from '../service/index.js';
import { statusCodes } from '../utils/http.js';
import { createErrorResponse, errorCodes } from '../utils/error-codes.js';

export async function handleRequestCode(req, res) {
    try {
        const { email } = req.body;
        
        await requestLoginCode(email);
        return res.status(statusCodes.OK).json({ 
            message: 'Verification code sent to email' 
        });
    } catch (error) {
        if (error.message === 'User not found') {
            return res.status(statusCodes.NOT_FOUND).json({
                code: errorCodes.USER_NOT_FOUND,
                message: 'User not found'
            });
        }
        if (error.message === 'Failed to send email') {
            return res.status(statusCodes.SERVICE_UNAVAILABLE).json({
                code: errorCodes.EMAIL_FAILED,
                message: 'Failed to send email. Please try again later.'
            });
        }
        return res.status(statusCodes.INTERNAL_SERVER_ERROR).json({
            code: errorCodes.INTERNAL_SERVER_ERROR,
            message: error.message
        });
    }
}

export async function handleVerifyCode(req, res) {
    try {
        const { email, code } = req.body;
        
        const result = await verifyLoginCode(email, code);
        return res.status(statusCodes.OK).json({ token: result.token });
    } catch (error) {
        if (error.message === 'Invalid code') {
            return res.status(statusCodes.BAD_REQUEST).json({
                code: errorCodes.INVALID_TOKEN,
                message: 'Invalid verification code'
            });
        }
        if (error.message === 'Code has expired') {
            return res.status(statusCodes.BAD_REQUEST).json({
                code: errorCodes.INVALID_TOKEN,
                message: 'Verification code has expired'
            });
        }
        if (error.message === 'No code found') {
            return res.status(statusCodes.BAD_REQUEST).json({
                code: errorCodes.INVALID_TOKEN,
                message: 'No verification code found'
            });
        }
        if (error.message === 'User not found') {
            return res.status(statusCodes.NOT_FOUND).json({
                code: errorCodes.USER_NOT_FOUND,
                message: 'User not found'
            });
        }
        return res.status(statusCodes.INTERNAL_SERVER_ERROR).json({
            code: errorCodes.INTERNAL_SERVER_ERROR,
            message: error.message
        });
    }
}
