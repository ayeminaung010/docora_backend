import { Router } from "express";
import { profileUpdate, verifyIdentityDoctor, viewUserDetails,getPopularDoctors } from "../controllers/doctor.controller";
import { authenticate } from "../middlewares/auth.middleware";
import { authorize } from "../middlewares/authorize.middleware";
import { viewScheduleDoctor } from "../controllers/schedule.controller";


const router = Router();
router.use(authenticate);
router.get("/schedule/:doctorId", viewScheduleDoctor);

// router.use(authorize(["DOCTOR"]));

router.post("/verifyIdentity" , verifyIdentityDoctor );
router.patch("/profile/update",  profileUpdate );
router.get("/popularDoctors", getPopularDoctors);
router.get("/user/details/:id", viewUserDetails);

export default router;