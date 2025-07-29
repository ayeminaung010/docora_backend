import { Router } from "express";
import { profileUpdate, verifyIdentityDoctor } from "../controllers/doctor.controller";
import { authenticate } from "../middlewares/auth.middleware";


const router = Router();

router.use(authenticate);

router.post("/verifyIdentity" , verifyIdentityDoctor );
router.patch("/profile/update",  profileUpdate );

export default router;