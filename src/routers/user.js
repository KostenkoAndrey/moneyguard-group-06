import { Router } from "express";
import { userInfoController } from "../controllers/auth.js";
import { ctrlWrapper } from "../utils/ctrlWrapper.js";


const router = Router();

//** USER Info   */
router.get('/user', ctrlWrapper(userInfoController));
export default router;