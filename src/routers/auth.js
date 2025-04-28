import express from 'express';
import {
    registerController,
    loginController,
    logoutController,
    refreshController,
    requestPasswordResetController,
    resetPasswordController
} from '../controllers/auth.js';

import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import {
    loginSchema,
    registerSchema,
    requestPasswordResetSchema,
    resetPasewordSchema
} from '../validation/user.js';

import { validateBody } from '../middlewares/validateBody.js';
import { upload } from "../middlewares/upload.js";


const router = express.Router();
const jsonParser = express.json();


//** register user   */
router.post(
    '/register',
    upload.single('photo'),
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


//** request password reset   */
router.post(
    '/send-reset-email',
    jsonParser,
    validateBody(requestPasswordResetSchema),
    ctrlWrapper(requestPasswordResetController));


//** reset password   */
router.post(
    '/reset-pwd',
    jsonParser,
    validateBody(resetPasewordSchema),
    ctrlWrapper(resetPasswordController)
);



export default router;