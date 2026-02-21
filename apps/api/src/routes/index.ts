// This file is responsible for authenticating users
import { Router } from "express";
import authRoutes from "./auth";
import eventRoutes from "./event";
import boardRoutes from "./board";


const router = Router();

router.use("/auth", authRoutes);
router.use("/event", eventRoutes);
router.use("/board", boardRoutes);

export default router;