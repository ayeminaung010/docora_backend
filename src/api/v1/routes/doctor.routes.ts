import { Router } from "express";
import {
    addNoteToConsultation,
    endConsultation,
    viewConsultation,
} from "../controllers/consultations.controller";
import {
    profileUpdate,
    verifyIdentityDoctor,
    viewUserDetails,
} from "../controllers/doctor.controller";
import { authenticate } from "../middlewares/auth.middleware";
import { authorize } from "../middlewares/authorize.middleware";
import { viewScheduleDoctor } from "../controllers/schedule.controller";
import { getPopularDoctors } from "../controllers/patient.controller";

const router = Router();

router.use(authenticate);
// for identity page
router.post("/verifyIdentity", verifyIdentityDoctor);

//for home page
// router.get("/home", getHomeData) // home page
// router.get("/notificatons", getNotifications) // go to noti page

//for appointment page
// router.get("/consultations/upcoming", getUpcomingConsultations)
// router.get("/consultations/past", getPastConsultations)
// router.get("/consultations/filter", getFilteredConsultations)

//for consultation page
router.post("/consultation/end/:id", endConsultation);
router.post("/consultation/note/create/:id", addNoteToConsultation);


// for scheduling page 
router.get("/schedule/:doctorId", viewScheduleDoctor);
// router.post("/schedule/create", createSchedule)
// router.post("/schedule/delete", deleteSchedule)

//for chat page
// router.get("/chats", getChats)
// router.get("/chats/:chatId", viewChat)

//for patient consultation note
// router.get("/patientNote/:patientId", viewPatientNote)

// router.use(authorize(["DOCTOR"]));

//for profile
router.patch("/profile/update", profileUpdate);
router.get("/popularDoctors", getPopularDoctors);
router.get("/user/details/:id", viewUserDetails);
router.get("/consultationData/:id",viewConsultation);
export default router;


// doctor consulation 
// doctor end consulation -> end consultation
// doctor create consulation note 
// doctor view consulation note
