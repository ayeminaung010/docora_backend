import { Router } from "express";
import {
  patientDetailForm,
  patientProfileUpdate,
} from "../controllers/patient.controller";
import { authenticate } from "../middlewares/auth.middleware";
import { authorize } from "../middlewares/authorize.middleware";
import { createConsultation } from "../controllers/consulatations.controller";

const router = Router();
// router.use(authorize(["PATIENT"]));
router.use(authenticate);

router.post("/patientDetailForm", patientDetailForm);
router.patch("/patientInfoUpdate", patientProfileUpdate);

// for home page

// for appointment page
// router.get("/consultations/upcoming", getUpcomingConsultations)
// router.get("/consultations/past", getPastConsultations)
// router.get("/consultations/filter", getFilteredConsultations)

//for chat page
// router.get("/chats", getChats)
// router.get("/chats/:chatId", viewChat)

//for profile page

// router.get('doctor/:id', viewDoctorProfile);

// for booking appointment
router.post("/consultations/booking/:doctorId", createConsultation);

export default router;


// patient booking appointment -> create consultation //doing
// patient create healthconcerns -> create healthconcerns //done
// patient view consultation -> view consultation
// patient end consultation -> end consultation
// patient cancel consultation -> cancel consultation
// patient view consultation notes -> view consultation notes
// patient review doctor -> review doctor // done 