import { Router } from "express";
import { profileUpdate, verifyIdentityDoctor, viewUserDetails,getPopularDoctors } from "../controllers/doctor.controller";
import { authenticate } from "../middlewares/auth.middleware";
import { authorize } from "../middlewares/authorize.middleware";
import { viewScheduleDoctor } from "../controllers/schedule.controller";


const router = Router();

router.use(authenticate);
// for identity page 
router.post("/verifyIdentity" , verifyIdentityDoctor );

//for home page
// router.get("/home", getHomeData) // home page
// router.get("/notificatons", getNotifications) // go to noti page

//for appointment page
// router.get("/consulstaions/upcoming", getUpcomingConsulations)
// router.get("/consulstaions/past", getPastConsulations)
// router.get("/consulstaions/filter", getFilteredConsulations)
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
router.patch("/profile/update",  profileUpdate );
router.get("/popularDoctors", getPopularDoctors);
router.get("/user/details/:id", viewUserDetails);

export default router;