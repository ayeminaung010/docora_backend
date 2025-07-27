import { Router } from "express";
import { signUp,login } from "../controllers/auth.controller";
import authenticate from "../middlewares/auth.middleware";

const router = Router();
router.post("/signup", signUp);
router.post("/login", login);

// router.post("/verifyToken",authenticate , verifyToken);




export default router;