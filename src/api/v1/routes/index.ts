import { Router } from "express";
import userRouter from "./user.routes";
import authRouter from "./auth.routes";
import patientRouter from './patient.route';

const router = Router();
router.use("/auth",authRouter);
router.use("/users",userRouter);
router.use("/patients", patientRouter);
// router.use("/doctors", doctorRouter);
export default router;