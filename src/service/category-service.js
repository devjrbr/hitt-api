import {  fetchAllCategories } from '../repository/index.js';

export function getAllCategories() {
    const categories = fetchAllCategories();
    return categories;
}
