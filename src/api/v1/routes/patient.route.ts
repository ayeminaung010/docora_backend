import { Router } from "express";
import {
  filterBySpecialty,
  getPopularDoctors,
  patientDetailForm,
  patientProfileUpdate,
  searchDoctorsByName,
  searchDoctorsByNameAndSpecialty,
} from "../controllers/patient.controller";
import { authenticate } from "../middlewares/auth.middleware";
import { authorize } from "../middlewares/authorize.middleware";

const router = Router();
// router.use(authorize(["PATIENT"]));
router.use(authenticate);

router.post("/patientDetailForm", patientDetailForm);
router.patch("/patientInfoUpdate", patientProfileUpdate);
router.get("/popularDoctors", getPopularDoctors);
router.get("/search/doctors/name", searchDoctorsByName);
router.get("/search/:specialty/name", searchDoctorsByNameAndSpecialty);
router.get("/search/:specialty", filterBySpecialty);



export default router;
