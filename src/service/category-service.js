import { fetchAllCategories, createCategory, findCategoryById, updateCategory, deleteCategory } from '../repository/index.js';

export async function getAllCategories() {
    const categories = await fetchAllCategories();
    return categories;
}

export async function createNewCategory(categoryData) {
    const category = await createCategory(categoryData);
    return {
        id: category.id,
        name: category.name,
        created_at: category.created_at,
        updated_at: category.updated_at
    };
}

export async function getCategoryById(id) {
    const category = await findCategoryById(id);
    if (!category) {
        return null;
    }
    return category;
}

export async function updateCategoryById(id, categoryData) {
    const category = await updateCategory(id, categoryData);
    return category;
}

export async function deleteCategoryById(id) {
    return await deleteCategory(id);
}
