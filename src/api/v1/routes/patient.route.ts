import { Router } from "express";
import {
  patientDetailForm,
  patientProfileUpdate,
} from "../controllers/patient.controller";
import { authenticate } from "../middlewares/auth.middleware";
import { authorize } from "../middlewares/authorize.middleware";

const router = Router();
// router.use(authorize(["PATIENT"]));
router.use(authenticate);

router.post("/patientDetailForm", patientDetailForm);
router.patch("/patientInfoUpdate", patientProfileUpdate);

export default router;
