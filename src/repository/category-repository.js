import { AppDataSource } from '../database/data-source.js';
import { CategoryDatabase } from '../database/entity/index.js';

export async function fetchAllCategories() {
  const categoryRepository = AppDataSource.getRepository(CategoryDatabase);
  return await categoryRepository.find();
}

export async function createCategory(categoryData) {
  const categoryRepository = AppDataSource.getRepository(CategoryDatabase);
  
  try {
    const category = categoryRepository.create(categoryData);
    const savedCategory = await categoryRepository.save(category);
    return savedCategory;
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY' || error.code === '23505') {
      const errorMessage = error.message?.toLowerCase() || '';
      const errorDetail = error.detail?.toLowerCase() || '';
      
      if (errorDetail.includes('key (name)') || errorMessage.includes('name')) {
        const duplicateError = new Error('Category name already exists');
        duplicateError.code = 'NAME_DUPLICATE';
        throw duplicateError;
      }
      
      const duplicateError = new Error('Duplicate entry detected');
      duplicateError.code = 'DUPLICATE_ENTRY';
      throw duplicateError;
    }
    throw error;
  }
}

export async function findCategoryById(id) {
  const categoryRepository = AppDataSource.getRepository(CategoryDatabase);
  return await categoryRepository.findOne({ where: { id } });
}

export async function updateCategory(id, categoryData) {
  const categoryRepository = AppDataSource.getRepository(CategoryDatabase);
  
  try {
    await categoryRepository.update(id, categoryData);
    return await categoryRepository.findOne({ where: { id } });
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY' || error.code === '23505') {
      const errorMessage = error.message?.toLowerCase() || '';
      const errorDetail = error.detail?.toLowerCase() || '';
      
      if (errorDetail.includes('key (name)') || errorMessage.includes('name')) {
        const duplicateError = new Error('Category name already exists');
        duplicateError.code = 'NAME_DUPLICATE';
        throw duplicateError;
      }
      
      const duplicateError = new Error('Duplicate entry detected');
      duplicateError.code = 'DUPLICATE_ENTRY';
      throw duplicateError;
    }
    throw error;
  }
}

export async function deleteCategory(id) {
  const categoryRepository = AppDataSource.getRepository(CategoryDatabase);
  const result = await categoryRepository.delete(id);
  return result.affected > 0;
}
