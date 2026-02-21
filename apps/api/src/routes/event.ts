import { Router } from "express";
import { createEvent, getEventById, getEvents} from "../controllers/event";
import multer from "multer";


const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post("/createEvent", upload.single("posterImage"), createEvent);

// get all events - front will sort it out
router.get("/getEvents", getEvents);

router.get("/getEventById/:id", getEventById);

export default router;