export const errorCodes = {
    VALIDATION_ERROR: 'VALIDATION_ERROR',
    INVALID_EMAIL: 'INVALID_EMAIL',
    INVALID_CPF: 'INVALID_CPF',
    INVALID_PHONE: 'INVALID_PHONE',
    INVALID_DATE: 'INVALID_DATE',
    REQUIRED_FIELD: 'REQUIRED_FIELD',
    INVALID_ENUM_VALUE: 'INVALID_ENUM_VALUE',
    
    USER_NOT_FOUND: 'USER_NOT_FOUND',
    USER_ALREADY_EXISTS: 'USER_ALREADY_EXISTS',
    EMAIL_ALREADY_EXISTS: 'EMAIL_ALREADY_EXISTS',
    CPF_ALREADY_EXISTS: 'CPF_ALREADY_EXISTS',
    DUPLICATE_ENTRY: 'DUPLICATE_ENTRY',
    
    CATEGORY_NOT_FOUND: 'CATEGORY_NOT_FOUND',
    CATEGORY_NAME_ALREADY_EXISTS: 'CATEGORY_NAME_ALREADY_EXISTS',
    FORBIDDEN: 'FORBIDDEN',
    
    TOKEN_REQUIRED: 'TOKEN_REQUIRED',
    INVALID_TOKEN: 'INVALID_TOKEN',
    EXPIRED_TOKEN: 'EXPIRED_TOKEN',
    UNAUTHORIZED: 'UNAUTHORIZED',
    
    EMAIL_FAILED: 'EMAIL_FAILED',
    
    INVALID_ID: 'INVALID_ID',
    INTERNAL_SERVER_ERROR: 'INTERNAL_SERVER_ERROR'
};

export function createErrorResponse(code, message, field = null) {
    const response = {
        code,
        message
    };
    
    if (field) {
        response.field = field;
    }
    
    return response;
}

export function createValidationErrorResponse(details) {
    return {
        code: errorCodes.VALIDATION_ERROR,
        message: 'Validation failed',
        details: details.map(detail => ({
            field: detail.path?.[0] || detail.context?.key,
            message: detail.message,
            code: getValidationErrorCode(detail)
        }))
    };
}

function getValidationErrorCode(detail) {
    const message = detail.message.toLowerCase();
    
    if (message.includes('email')) return errorCodes.INVALID_EMAIL;
    if (message.includes('cpf')) return errorCodes.INVALID_CPF;
    if (message.includes('phone')) return errorCodes.INVALID_PHONE;
    if (message.includes('date')) return errorCodes.INVALID_DATE;
    if (message.includes('required')) return errorCodes.REQUIRED_FIELD;
    if (message.includes('must be one of')) return errorCodes.INVALID_ENUM_VALUE;
    
    return errorCodes.VALIDATION_ERROR;
}
