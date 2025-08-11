import { Router } from "express";
import express from 'express'; // <-- Add this import
import { signUp, login, verifyToken, checkTokenStatus, changePassword, logout, forgotPassword, resetPassword, verifyOTP,sendSignUpOTP , getMeAuth } from "../controllers/auth.controller";
import {
  authenticate,
  authenticateTokenWithAutoRefresh,
} from "../middlewares/auth.middleware";

const router = Router();

// Add the JSON body parsing middleware here
router.use(express.json());

router.post("/signup", signUp);
router.post("/login", login);
router.post("/forgotPassword", forgotPassword);
router.post("/verifyOTP", verifyOTP)
router.post("/resetPassword", resetPassword);
router.post("/sendSignUpOTP", sendSignUpOTP);

router.post("/refreshToken", authenticateTokenWithAutoRefresh, checkTokenStatus);
router.use(authenticate);
router.get('/me', getMeAuth);
router.post("/verifyToken", verifyToken);
router.patch("/changePassword", changePassword);
router.post("/logout", logout)

export default router;