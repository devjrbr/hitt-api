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
            return res.status(statusCodes.NOT_FOUND).json(
                createErrorResponse(errorCodes.USER_NOT_FOUND, 'User not found')
            );
        }
        if (error.message === 'Failed to send email') {
            return res.status(statusCodes.SERVICE_UNAVAILABLE).json(
                createErrorResponse(errorCodes.EMAIL_FAILED, 'Failed to send email. Please try again later.')
            );
        }
        return res.status(statusCodes.INTERNAL_SERVER_ERROR).json(
            createErrorResponse(errorCodes.INTERNAL_SERVER_ERROR, error.message)
        );
    }
}

export async function handleVerifyCode(req, res) {
    try {
        const { email, code } = req.body;
        
        const result = await verifyLoginCode(email, code);
        return res.status(statusCodes.OK).json({ token: result.token });
    } catch (error) {
        if (error.message === 'Invalid code') {
            return res.status(statusCodes.BAD_REQUEST).json(
                createErrorResponse(errorCodes.INVALID_TOKEN, 'Invalid verification code')
            );
        }
        if (error.message === 'Code has expired') {
            return res.status(statusCodes.BAD_REQUEST).json(
                createErrorResponse(errorCodes.INVALID_TOKEN, 'Verification code has expired')
            );
        }
        if (error.message === 'No code found') {
            return res.status(statusCodes.BAD_REQUEST).json(
                createErrorResponse(errorCodes.INVALID_TOKEN, 'No verification code found')
            );
        }
        if (error.message === 'User not found') {
            return res.status(statusCodes.NOT_FOUND).json(
                createErrorResponse(errorCodes.USER_NOT_FOUND, 'User not found')
            );
        }
        return res.status(statusCodes.INTERNAL_SERVER_ERROR).json(
            createErrorResponse(errorCodes.INTERNAL_SERVER_ERROR, error.message)
        );
    }
}
