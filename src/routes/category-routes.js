import { Router } from 'express';
import { handleGetAllCategories } from '../controller/index.js';

const categoryRouter = Router()
categoryRouter.get('/', handleGetAllCategories);
export default categoryRouter;
