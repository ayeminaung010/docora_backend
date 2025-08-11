import { Router } from "express";
import {
  cancelConsultation,
  createConsultation,
  getPastConsultations,
  getUpcomingConsultations,
  viewConsultationNote,
} from "../controllers/consultations.controller";
import {
  filterBySpecialty,
  getPopularDoctors,
  getProfilePatient,
  giveDoctorReview,
  patientDetailForm,
  patientProfileUpdate,
  searchDoctorsByName,
  searchDoctorsByNameAndSpecialty,
  viewDoctorProfile,
} from "../controllers/patient.controller";
import { authenticate } from "../middlewares/auth.middleware";

const router = Router();
// router.use(authorize(["PATIENT"]));
router.use(authenticate);
router.get("/profile", getProfilePatient);
router.post("/patientDetailForm", patientDetailForm);
router.patch("/patientInfoUpdate", patientProfileUpdate);
router.get("/popularDoctors", getPopularDoctors);
router.get("/search/doctors/name", searchDoctorsByName);
router.get("/search/:specialty/name", searchDoctorsByNameAndSpecialty);
router.get("/search/:specialty", filterBySpecialty);
router.get("/doctor/:id", viewDoctorProfile);
router.post("/doctorReview", giveDoctorReview);
// for home page

// for appointment page
router.get("/consultations/upcoming", getUpcomingConsultations);
router.get("/consultations/past", getPastConsultations);
// router.get("/consultations/filter", getFilteredConsultations)
router.get("/consultation/note/:id", viewConsultationNote);
router.post("/consultation/cancel/:id", cancelConsultation);

//for chat page
// router.get("/chats", getChats)
// router.get("/chats/:chatId", viewChat)

// for booking appointment
router.post("/consultations/booking/:doctorId", createConsultation);

export default router;

// patient booking appointment -> create consultation //done
// patient create healthconcerns -> create healthconcerns //done - same with booking appointment
// patient view consultation -> view consultation
// patient end consultation -> end consultation
// patient cancel consultation -> cancel consultation
// patient view consultation notes -> view consultation notes //done
// patient review doctor -> review doctor // done
