import { Router } from "express";
import { UserAuthController } from "../controllers/auth/user.auth.controller";

const router = Router()

router.post('/login', UserAuthController.userLogin)
router.post('/refresh', UserAuthController.refreshToken)
router.post('/register', UserAuthController.registerUser)

export default router