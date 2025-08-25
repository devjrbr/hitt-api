import { Router } from 'express';
import { 
    handleGetAllCategories, 
    handleCreateCategory, 
    handleGetCategoryById, 
    handleUpdateCategory, 
    handleDeleteCategory 
} from '../controller/index.js';
import { 
    validateCategory, 
    validateId, 
    authenticateToken, 
    requireAdmin 
} from '../middleware/index.js';

const categoryRouter = Router();

categoryRouter.get('/', authenticateToken, handleGetAllCategories);
categoryRouter.get('/:id', authenticateToken, validateId, handleGetCategoryById);

categoryRouter.post('/', authenticateToken, requireAdmin, validateCategory, handleCreateCategory);
categoryRouter.put('/:id', authenticateToken, requireAdmin, validateId, validateCategory, handleUpdateCategory);
categoryRouter.delete('/:id', authenticateToken, requireAdmin, validateId, handleDeleteCategory);

export default categoryRouter;
