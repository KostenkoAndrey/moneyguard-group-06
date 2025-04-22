import express from 'express';
import {
    registerController,
    loginController,
    logoutController,
    refreshController
} from '../controllers/auth.js';

import { ctrlWrapper } from '../utils/ctrlWrapper.js';

import {
    loginSchema,
    registerSchema
} from '../validation/user.js';

import { validateBody } from '../middlewares/validateBody.js';

const router = express.Router();
const jsonParser = express.json();


//** register user   */
router.post(
    '/register',
    jsonParser,
    validateBody(registerSchema),
    ctrlWrapper(registerController));

//** login user   */
router.post(
    '/login',
    jsonParser,
    validateBody(loginSchema),
    ctrlWrapper(loginController));

//** logout user   */
router.post('/logout', ctrlWrapper(logoutController));

//** refresh session   */
router.post('/refresh', ctrlWrapper(refreshController));



export default router;