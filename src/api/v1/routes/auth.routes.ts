import { Router } from "express";
import { signUp, login, verifyToken, checkTokenStatus, changePassword, logout } from "../controllers/auth.controller";
import {
  authenticate,
  authenticateTokenWithAutoRefresh,
} from "../middlewares/auth.middleware";

const router = Router();
router.post("/signup", signUp);
router.post("/login", login);

router.post("/refreshToken", authenticateTokenWithAutoRefresh, checkTokenStatus);
router.use(authenticate);
router.post("/verifyToken", verifyToken);
router.patch("/changePassword", changePassword);
router.post("/logout", logout)

export default router;
