import { Router } from "express";
import {
  filterBySpecialty,
  getPopularDoctors,
  giveDoctorReview,
  patientDetailForm,
  patientProfileUpdate,
  searchDoctorsByName,
  searchDoctorsByNameAndSpecialty,
  viewDoctorProfile,
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
router.get("/doctor/:id", viewDoctorProfile);
router.post("/doctorReview",giveDoctorReview);
// for home page

// for appointment page
// router.get("/consultaions/upcoming", getUpcomingConsulations)
// router.get("/consultaions/past", getPastConsulations)
// router.get("/consultaions/filter", getFilteredConsulations)

//for chat page
// router.get("/chats", getChats)
// router.get("/chats/:chatId", viewChat)

//for profile page



// for booking appointment
// router.get("/consultaions/booking", createConsulation)


export default router;
