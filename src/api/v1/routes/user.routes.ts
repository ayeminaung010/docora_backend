import { Router } from "express";
import { getPatients } from "../controllers/user.controller";
import { viewConsultation } from "../controllers/consultations.controller";

const router = Router();
router.get("/all", getPatients);


export default router;