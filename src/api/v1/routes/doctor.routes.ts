import { Router } from "express";
import { profileUpdate, verifyIdentityDoctor, viewUserDetails,getPopularDoctors } from "../controllers/doctor.controller";
import { authenticate } from "../middlewares/auth.middleware";
import { authorize } from "../middlewares/authorize.middleware";


const router = Router();

// router.use(authorize(["DOCTOR"]));
router.use(authenticate);

router.post("/verifyIdentity" , verifyIdentityDoctor );
router.patch("/profile/update",  profileUpdate );
router.get("/popularDoctors", getPopularDoctors);
router.get("/user/details/:id", viewUserDetails);

export default router;