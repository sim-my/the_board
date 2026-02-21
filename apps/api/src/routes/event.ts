import { Router } from "express";
import { createEvent, getEventById, getEvents} from "../controllers/event";
import { getAttendance, setAttendance } from "../controllers/attendance";
import { authMiddleware } from "../middlewares";
import multer from "multer";


const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post("/createEvent", upload.single("posterImage"), createEvent);

// get all events - front will sort it out
router.get("/getEvents", getEvents);

router.get("/getEventById/:id", getEventById);

// Attendance — requires auth
router.get("/:id/attend", authMiddleware, getAttendance);
router.post("/:id/attend", authMiddleware, setAttendance);

export default router;