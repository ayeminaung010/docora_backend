import { Router } from "express";
import { verifyIdentityDoctor } from "../controllers/doctor.controller";
import { authenticate } from "../middlewares/auth.middleware";


const router = Router();

router.use(authenticate);

router.post("/verifyIdentity" ,verifyIdentityDoctor );

export default router;