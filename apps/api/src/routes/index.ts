// This file is responsible for authenticating users
import { Router } from "express";
import authRoutes from "./auth";
import eventRoutes from "./event";


const router = Router();

router.use("/auth", authRoutes);
router.use("/event", eventRoutes);

export default router;