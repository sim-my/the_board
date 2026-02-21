import { Router } from "express";
import { createEvent, getEvents} from "../controllers/event";
import multer from "multer";


const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post("/createEvent", upload.single("posterImage"), createEvent);

// get events with tags
router.get("/getEvents", getEvents);
// router.get("getEventById", getEventById);

export default router;