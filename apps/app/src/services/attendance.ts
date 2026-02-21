import { api } from "./api";
import type { AttendanceStatus } from "../components/AttendanceSelector";

type AttendanceResponse = {
  counts: { going: number; maybe: number; not_going: number };
  myStatus: AttendanceStatus;
};

export const attendanceService = {
  get: (eventId: string) =>
    api.get<AttendanceResponse>(`/event/${eventId}/attend`),

  set: (eventId: string, status: AttendanceStatus) =>
    api.post<AttendanceResponse>(`/event/${eventId}/attend`, { status }),
};
