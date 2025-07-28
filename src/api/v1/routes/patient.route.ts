import { Router } from "express";
import {
  patientDetailForm,
  patientInfoUpdate,
} from "../controllers/patient.controller";
import { authenticate } from "../middlewares/auth.middleware";

const router = Router();
router.use(authenticate);

router.post("/patientDetailForm", patientDetailForm);
router.patch("/patientInfoUpdate", patientInfoUpdate);

export default router;
