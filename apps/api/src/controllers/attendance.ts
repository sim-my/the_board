import { Request, Response, NextFunction } from "express";
import {
  upsertAttendance,
  deleteAttendance,
  getAttendanceCounts,
  getUserAttendanceStatus,
  type AttendanceStatus,
} from "../services/attendance";

// GET /api/event/:id/attend
// Returns current user's status + counts for the event
export async function getAttendance(req: Request, res: Response, next: NextFunction) {
  try {
    const eventId = parseInt(req.params.id as string);
    const userEmail = req.user?.username as string;

    const [counts, myStatus] = await Promise.all([
      getAttendanceCounts(eventId),
      getUserAttendanceStatus(userEmail, eventId),
    ]);

    return res.json({ counts, myStatus });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to get attendance";
    return res.status(500).json({ error: true, message });
  }
}

// POST /api/event/:id/attend
// Body: { status: "going" | "maybe" | "not_going" | null }
export async function setAttendance(req: Request, res: Response, next: NextFunction) {
  try {
    const eventId = parseInt(req.params.id as string);
    const userEmail = req.user?.username as string;
    const { status } = req.body as { status: AttendanceStatus | null };

    if (status === null || status === undefined) {
      await deleteAttendance(userEmail, eventId);
    } else {
      if (!["going", "maybe", "not_going"].includes(status)) {
        return res.status(400).json({ error: true, message: "Invalid status" });
      }
      await upsertAttendance(userEmail, eventId, status);
    }

    const counts = await getAttendanceCounts(eventId);
    return res.json({ counts, myStatus: status ?? null });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to set attendance";
    return res.status(500).json({ error: true, message });
  }
}
