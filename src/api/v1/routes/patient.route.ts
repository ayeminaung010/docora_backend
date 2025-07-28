import { Router } from "express";
import { patientDetailForm, patientInfoUpdate } from "../controllers/patient.controller";

const router=Router();
router.post("/patientDetailForm", patientDetailForm);
router.patch("/patientInfoUpdate", patientInfoUpdate);


export default router;