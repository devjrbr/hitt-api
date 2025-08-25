import { getAllUsers, createNewUser, getUserById, updateUserById, deleteUserById } from '../service/index.js';
import { statusCodes } from '../utils/http.js';
import { createErrorResponse, errorCodes } from '../utils/error-codes.js';
import { generateUserJWT } from '../utils/jwt.js';

export async function handleGetAllUsers(req, res) {
    try {
        const users = await getAllUsers();
        return res.status(statusCodes.OK).json(users);
    } catch (error) {
        return res.status(statusCodes.INTERNAL_SERVER_ERROR).json({
            code: errorCodes.INTERNAL_SERVER_ERROR,
            message: error.message
        });
    }
}

export async function handleCreateUser(req, res) {
    try {
        const user = await createNewUser(req.body);
        return res.status(statusCodes.CREATED).json({ token: user.token });
    } catch (error) {
        if (error.code === 'EMAIL_DUPLICATE') {
            return res.status(statusCodes.CONFLICT).json({
                code: errorCodes.EMAIL_ALREADY_EXISTS,
                message: 'This email is already registered'
            });
        }
        if (error.code === 'CPF_DUPLICATE') {
            return res.status(statusCodes.CONFLICT).json({
                code: errorCodes.CPF_ALREADY_EXISTS,
                message: 'This CPF is already registered'
            });
        }
        if (error.code === 'DUPLICATE_ENTRY') {
            return res.status(statusCodes.CONFLICT).json({
                code: errorCodes.DUPLICATE_ENTRY,
                message: 'User information already exists in the system'
            });
        }
        return res.status(statusCodes.INTERNAL_SERVER_ERROR).json({
            code: errorCodes.INTERNAL_SERVER_ERROR,
            message: error.message
        });
    }
}

export async function handleGetUserById(req, res) {
    try {
        const { id } = req.params;
        const user = await getUserById(parseInt(id));
        
        if (!user) {
            return res.status(statusCodes.NOT_FOUND).json({
                code: errorCodes.USER_NOT_FOUND,
                message: 'User not found'
            });
        }
        
        return res.status(statusCodes.OK).json(user);
    } catch (error) {
        return res.status(statusCodes.INTERNAL_SERVER_ERROR).json({
            code: errorCodes.INTERNAL_SERVER_ERROR,
            message: error.message
        });
    }
}

export async function handleUpdateUser(req, res) {
    try {
        const { id } = req.params;
        const user = await updateUserById(parseInt(id), req.body);
        
        if (!user) {
            return res.status(statusCodes.NOT_FOUND).json({
                code: errorCodes.USER_NOT_FOUND,
                message: 'User not found'
            });
        }
        
        return res.status(statusCodes.OK).json(user);
    } catch (error) {
        return res.status(statusCodes.INTERNAL_SERVER_ERROR).json({
            code: errorCodes.INTERNAL_SERVER_ERROR,
            message: error.message
        });
    }
}

export async function handleDeleteUser(req, res) {
    try {
        const { id } = req.params;
        const deleted = await deleteUserById(parseInt(id));
        
        if (!deleted) {
            return res.status(statusCodes.NOT_FOUND).json({
                code: errorCodes.USER_NOT_FOUND,
                message: 'User not found'
            });
        }
        
        return res.status(statusCodes.OK).json({ message: 'User deleted successfully' });
    } catch (error) {
        return res.status(statusCodes.INTERNAL_SERVER_ERROR).json({
            code: errorCodes.INTERNAL_SERVER_ERROR,
            message: error.message
        });
    }
}

export async function handleGetProfile(req, res) {
    try {
        const userId = req.user.id;
        const user = await getUserById(userId);
        
        if (!user) {
            return res.status(statusCodes.NOT_FOUND).json({
                code: errorCodes.USER_NOT_FOUND,
                message: 'User not found'
            });
        }
        

        const { token, login_code, ...profile } = user;
        return res.status(statusCodes.OK).json(profile);
    } catch (error) {
        return res.status(statusCodes.INTERNAL_SERVER_ERROR).json({
            code: errorCodes.INTERNAL_SERVER_ERROR,
            message: error.message
        });
    }
}

export async function handleUpdateProfile(req, res) {
    try {
        const userId = req.user.id;
        const user = await updateUserById(userId, req.body);
        
        if (!user) {
            return res.status(statusCodes.NOT_FOUND).json({
                code: errorCodes.USER_NOT_FOUND,
                message: 'User not found'
            });
        }
        

        const newToken = generateUserJWT(user);
        return res.status(statusCodes.OK).json({ token: newToken });
    } catch (error) {
        if (error.code === 'EMAIL_DUPLICATE') {
            return res.status(statusCodes.CONFLICT).json({
                code: errorCodes.EMAIL_ALREADY_EXISTS,
                message: 'This email is already registered'
            });
        }
        if (error.code === 'CPF_DUPLICATE') {
            return res.status(statusCodes.CONFLICT).json({
                code: errorCodes.CPF_ALREADY_EXISTS,
                message: 'This CPF is already registered'
            });
        }
        if (error.code === 'DUPLICATE_ENTRY') {
            return res.status(statusCodes.CONFLICT).json({
                code: errorCodes.DUPLICATE_ENTRY,
                message: 'User information already exists in the system'
            });
        }
        return res.status(statusCodes.INTERNAL_SERVER_ERROR).json({
            code: errorCodes.INTERNAL_SERVER_ERROR,
            message: error.message
        });
    }
}
