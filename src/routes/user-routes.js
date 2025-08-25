import { Router } from 'express';
import { handleCreateUser, handleGetAllUsers, handleGetUserById, handleUpdateUser, handleDeleteUser, handleGetProfile, handleUpdateProfile } from '../controller/index.js';
import { validateUser, validateUserPartial, validateId, authenticateToken } from '../middleware/index.js';

const userRouter = Router()
userRouter.get('/', handleGetAllUsers);
userRouter.get('/profile', authenticateToken, handleGetProfile);
userRouter.get('/:id', validateId, handleGetUserById);
userRouter.post('/', validateUser, handleCreateUser);
userRouter.put('/:id', validateId, validateUser, handleUpdateUser);
userRouter.patch('/', authenticateToken, validateUserPartial, handleUpdateProfile);
userRouter.patch('/:id', validateId, validateUser, handleUpdateUser);
userRouter.delete('/:id', validateId, handleDeleteUser);
export default userRouter;
