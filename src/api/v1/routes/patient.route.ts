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

// for home page

// for appointment page
// router.get("/consultaions/upcoming", getUpcomingConsulations)
// router.get("/consultaions/past", getPastConsulations)
// router.get("/consultaions/filter", getFilteredConsulations)

//for chat page
// router.get("/chats", getChats)
// router.get("/chats/:chatId", viewChat)

//for profile page


// router.get('doctor/:id', viewDoctorProfile);

// for booking appointment
// router.get("/consultaions/booking", createConsulation)


export default router;
