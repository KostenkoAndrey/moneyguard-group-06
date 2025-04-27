import express from 'express';
import { Router } from "express";
import { userInfoController } from "../controllers/auth.js";
import { ctrlWrapper } from "../utils/ctrlWrapper.js";

// import { isValidId } from '../middlewares/isValidId.js';
import { validateBody } from '../middlewares/validateBody.js';
import { updateUserSchema } from '../validation/user.js';
import { updateUserSchemaController } from '../controllers/auth.js';

const router = Router();
const jsonParser = express.json();


//** USER Info   */
router.get('/user', ctrlWrapper(userInfoController));


//***          UPDATE-USER       ***//
router.patch(
    '/user',
    jsonParser,
    validateBody(updateUserSchema),
    ctrlWrapper(updateUserSchemaController));



export default router;