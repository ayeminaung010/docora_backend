import { Router } from "express";
import { verifyIdentityDoctor } from "../controllers/doctor.controller";
import { authenticate } from "../middlewares/auth.middleware";


const router = Router();
router.post("/verifyIdentity",authenticate ,verifyIdentityDoctor );

export default router;