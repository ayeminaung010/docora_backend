import { Router } from "express";
import { signUp, login, verifyToken, checkTokenStatus } from "../controllers/auth.controller";
import {
  authenticate,
  authenticateTokenWithAutoRefresh,
} from "../middlewares/auth.middleware";

const router = Router();
router.post("/signup", signUp);
router.post("/login", login);

router.post("/verifyToken", authenticate, verifyToken);
router.post("/refreshToken", authenticateTokenWithAutoRefresh, checkTokenStatus);

export default router;
