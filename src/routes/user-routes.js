import { Router } from 'express';
import { handleCreateUser, handleGetAllUsers, handleGetUserById, handleUpdateUser, handleDeleteUser, handleGetProfile, handleUpdateProfile, handlePromoteUser } from '../controller/index.js';
import { validateUser, validateUserPartial, validateId, authenticateToken, requireAdmin } from '../middleware/index.js';

const userRouter = Router();

userRouter.post('/', validateUser, handleCreateUser);

userRouter.get('/profile', authenticateToken, handleGetProfile);
userRouter.patch('/', authenticateToken, validateUserPartial, handleUpdateProfile);

userRouter.get('/', authenticateToken, requireAdmin, handleGetAllUsers);
userRouter.get('/:id', authenticateToken, requireAdmin, validateId, handleGetUserById);
userRouter.put('/:id', authenticateToken, requireAdmin, validateId, validateUser, handleUpdateUser);
userRouter.patch('/:id', authenticateToken, requireAdmin, validateId, validateUserPartial, handleUpdateUser);
userRouter.delete('/:id', authenticateToken, requireAdmin, validateId, handleDeleteUser);
userRouter.patch('/:id/promote', authenticateToken, requireAdmin, validateId, handlePromoteUser);

export default userRouter;
