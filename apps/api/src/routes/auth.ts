// This file is responsible for authenticating users
import { Router } from "express";
import { sendOtp, verifyOtp, deleteUserAccount } from "../controllers/auth";

const router = Router();

router.post("/sendOtp", sendOtp);

router.post("/verifyOtp", verifyOtp);

router.post("/delete", deleteUserAccount);

export default router;