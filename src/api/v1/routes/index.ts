import { Router } from "express";
import userRouter from "./user.routes";
import authRouter from "./auth.routes";
import doctorRouter from "./doctor.routes";

const router = Router();
router.use("/auth",authRouter)
router.use("/patients", userRouter);
router.use("/doctors", doctorRouter);
export default router;