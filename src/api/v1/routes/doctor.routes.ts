import { Router } from "express";
import { getPopularDoctors, profileUpdate, verifyIdentityDoctor } from "../controllers/doctor.controller";
import { authenticate } from "../middlewares/auth.middleware";


const router = Router();

router.use(authenticate);

router.post("/verifyIdentity" , verifyIdentityDoctor );
router.patch("/profile/update",  profileUpdate );
router.get("/popularDoctors", getPopularDoctors);

export default router;