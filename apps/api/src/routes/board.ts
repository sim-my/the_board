import { Router } from "express";
import {getTags} from "../controllers/board";


const router = Router();

router.get("/getTags", getTags);

export default router;