import { Router } from "express";
import userRouter from "./user.routes.js";

const router = Router();
router.use("/patients", userRouter);
// router.use("/doctors", doctorRouter);

export default router;