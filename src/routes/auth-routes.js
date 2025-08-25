import { Router } from 'express';
import { handleRequestCode, handleVerifyCode } from '../controller/index.js';
import { validateAuthRequest, validateAuthCode } from '../middleware/index.js';

const authRouter = Router();

authRouter.post('/', validateAuthRequest, handleRequestCode);
authRouter.post('/code', validateAuthCode, handleVerifyCode);

export default authRouter;
