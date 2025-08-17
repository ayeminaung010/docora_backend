import { Router } from "express";
import {
    addNoteToConsultation,
    cancelConsultation,
    endConsultation,
    getPastConsultationsForDoctor,
    getUpcomingConsultationsForDoctor,
    viewConsultationDetails,
    viewConsultationNote,
    viewConsultation,
} from "../controllers/consultations.controller";
import {
    getProfileData,
    profileUpdate,
    verifyIdentityDoctor,
    viewUserDetails,
} from "../controllers/doctor.controller";
import { authenticate } from "../middlewares/auth.middleware";
import { authorize } from "../middlewares/authorize.middleware";
import { createSchedule, viewScheduleDoctor } from "../controllers/schedule.controller";
import { getPopularDoctors } from "../controllers/patient.controller";

const router = Router();

router.use(authenticate);
// for identity page
router.post("/verifyIdentity", verifyIdentityDoctor);

//for home page
// router.get("/home", getHomeData) // home page
// router.get("/notifications", getNotifications) // go to noti page

//for appointment page
router.get("/consultations/upcoming", getUpcomingConsultationsForDoctor)
router.get("/consultations/past", getPastConsultationsForDoctor)
router.get("/consultation/details/:id", viewConsultationDetails) // view consultation details
// router.get("/consultations/filter", getFilteredConsultations)
router.post("/consultation/cancel/:id", cancelConsultation);

//for consultation page
router.post("/consultation/end/:id", endConsultation);
router.post("/consultation/note/create/:id", addNoteToConsultation);
router.get("/consultation/note/:id", viewConsultationNote);


// for scheduling page
router.get("/schedule/:doctorId", viewScheduleDoctor);
router.post("/schedule/create", createSchedule) // not done 
// router.post("/schedule/delete", deleteSchedule)

//for chat page
// router.get("/chats", getChats)
// router.get("/chats/:chatId", viewChat)

//for patient consultation note
// router.get("/patientNote/:patientId", viewPatientNote)

// router.use(authorize(["DOCTOR"]));

//for profile
router.get("/profile",getProfileData);
router.patch("/profile/update", profileUpdate);

router.get("/popularDoctors", getPopularDoctors);
router.get("/user/details/:id", viewUserDetails);
router.get("/consultationData/:id",viewConsultation);
export default router;


// doctor consultation
// doctor view consultation details // health concerns data 
// doctor end consultation -> end consultation // done
// doctor create consultation note // done
// patient cancel consultation -> cancel consultation //done
// doctor view consultation note  // done