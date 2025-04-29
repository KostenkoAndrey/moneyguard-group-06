import { Router } from 'express';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';

import { validateBody } from '../middlewares/validateBody.js';
import { updateUserSchema } from '../validation/user.js';
import { upload } from '../middlewares/multer.js';
import { getUserController, patchUserController } from '../controllers/user.js';

const router = Router();

router.get('/user', ctrlWrapper(getUserController));
router.patch('/user', upload.single('photo'), validateBody(updateUserSchema), ctrlWrapper(patchUserController));

export default router;
