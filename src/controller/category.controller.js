import { getAllCategories, createNewCategory, getCategoryById, updateCategoryById, deleteCategoryById } from '../service/index.js';
import { statusCodes } from '../utils/http.js';
import { errorCodes } from '../utils/error-codes.js';

export async function handleGetAllCategories(req, res) {
    try {
        const categories = await getAllCategories();
        return res.status(statusCodes.OK).json(categories);
    } catch (error) {
        return res.status(statusCodes.INTERNAL_SERVER_ERROR).json({
            code: errorCodes.INTERNAL_SERVER_ERROR,
            message: error.message
        });
    }
}

export async function handleCreateCategory(req, res) {
    try {
        const category = await createNewCategory(req.body);
        return res.status(statusCodes.CREATED).json(category);
    } catch (error) {
        if (error.code === 'NAME_DUPLICATE') {
            return res.status(statusCodes.CONFLICT).json({
                code: errorCodes.CATEGORY_NAME_ALREADY_EXISTS,
                message: 'This category name already exists'
            });
        }
        if (error.code === 'DUPLICATE_ENTRY') {
            return res.status(statusCodes.CONFLICT).json({
                code: errorCodes.DUPLICATE_ENTRY,
                message: 'Category information already exists in the system'
            });
        }
        return res.status(statusCodes.INTERNAL_SERVER_ERROR).json({
            code: errorCodes.INTERNAL_SERVER_ERROR,
            message: error.message
        });
    }
}

export async function handleGetCategoryById(req, res) {
    try {
        const { id } = req.params;
        const category = await getCategoryById(parseInt(id));
        
        if (!category) {
            return res.status(statusCodes.NOT_FOUND).json({
                code: errorCodes.CATEGORY_NOT_FOUND,
                message: 'Category not found'
            });
        }
        
        return res.status(statusCodes.OK).json(category);
    } catch (error) {
        return res.status(statusCodes.INTERNAL_SERVER_ERROR).json({
            code: errorCodes.INTERNAL_SERVER_ERROR,
            message: error.message
        });
    }
}

export async function handleUpdateCategory(req, res) {
    try {
        const { id } = req.params;
        const category = await updateCategoryById(parseInt(id), req.body);
        
        if (!category) {
            return res.status(statusCodes.NOT_FOUND).json({
                code: errorCodes.CATEGORY_NOT_FOUND,
                message: 'Category not found'
            });
        }
        
        return res.status(statusCodes.OK).json(category);
    } catch (error) {
        if (error.code === 'NAME_DUPLICATE') {
            return res.status(statusCodes.CONFLICT).json({
                code: errorCodes.CATEGORY_NAME_ALREADY_EXISTS,
                message: 'This category name already exists'
            });
        }
        if (error.code === 'DUPLICATE_ENTRY') {
            return res.status(statusCodes.CONFLICT).json({
                code: errorCodes.DUPLICATE_ENTRY,
                message: 'Category information already exists in the system'
            });
        }
        return res.status(statusCodes.INTERNAL_SERVER_ERROR).json({
            code: errorCodes.INTERNAL_SERVER_ERROR,
            message: error.message
        });
    }
}

export async function handleDeleteCategory(req, res) {
    try {
        const { id } = req.params;
        const deleted = await deleteCategoryById(parseInt(id));
        
        if (!deleted) {
            return res.status(statusCodes.NOT_FOUND).json({
                code: errorCodes.CATEGORY_NOT_FOUND,
                message: 'Category not found'
            });
        }
        
        return res.status(statusCodes.OK).json({ message: 'Category deleted successfully' });
    } catch (error) {
        return res.status(statusCodes.INTERNAL_SERVER_ERROR).json({
            code: errorCodes.INTERNAL_SERVER_ERROR,
            message: error.message
        });
    }
}
