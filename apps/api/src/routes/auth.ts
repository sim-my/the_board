// This file is responsible for authenticating users
import { Router } from "express";
import { sendOtp, verifyOtp, logout, deleteUserAccount } from "../controllers/auth";

const router = Router();

router.post("/sendOtp", sendOtp);

router.post("/verifyOtp", verifyOtp);

router.post("/logout", logout);

router.post("/delete", deleteUserAccount);

export default router;