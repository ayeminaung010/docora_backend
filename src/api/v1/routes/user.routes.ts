import { Router } from "express";
import { getPatients } from "../controllers/user.controller";

const router = Router();
router.get("/all", getPatients);

export default router;