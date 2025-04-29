import express from 'express';

import {
  logoutController,
  refreshController,
  requestPasswordResetController,
  resetPasswordController,
  registerUserController,
  loginUserController,
} from '../controllers/auth.js';

import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import {
  loginSchema,
  registerSchema,
  requestPasswordResetSchema,
  resetPasewordSchema,
} from '../validation/user.js';

import { validateBody } from '../middlewares/validateBody.js';

const router = express.Router();
const jsonParser = express.json();

//** register user   */
router.post('/register', jsonParser, validateBody(registerSchema), ctrlWrapper(registerUserController));

//** login user   */
router.post('/login', jsonParser, validateBody(loginSchema), ctrlWrapper(loginUserController));

//** logout user   */
router.post('/logout', ctrlWrapper(logoutController));

//** refresh session   */
router.post('/refresh', ctrlWrapper(refreshController));

//** request password reset   */
router.post(
  '/send-reset-email',
  jsonParser,
  validateBody(requestPasswordResetSchema),
  ctrlWrapper(requestPasswordResetController),
);

//** reset password   */
router.post(
  '/reset-pwd',
  jsonParser,
  validateBody(resetPasewordSchema),
  ctrlWrapper(resetPasswordController),
);

export default router;
