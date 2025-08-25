import { getAllCategories } from '../service/index.js';

export function handleGetAllCategories(req, res) {
    const categories = getAllCategories();
    return res.status(200).json(categories);
}
