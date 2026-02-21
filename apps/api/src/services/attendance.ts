import { db } from "../db";
import { attendee, user, event as eventTable } from "../db/schema";
import { eq, and, sql } from "drizzle-orm";

export type AttendanceStatus = "going" | "maybe" | "not_going";

export const upsertAttendance = async (
  userEmail: string,
  eventId: number,
  status: AttendanceStatus
) => {
  const [found] = await db
    .select({ id: user.id })
    .from(user)
    .where(eq(user.email, userEmail))
    .limit(1);

  if (!found) throw new Error(`User not found: ${userEmail}`);

  await db
    .insert(attendee)
    .values({ userId: found.id, eventId, status })
    .onConflictDoUpdate({
      target: [attendee.userId, attendee.eventId],
      set: { status },
    });
};

export const deleteAttendance = async (userEmail: string, eventId: number) => {
  const [found] = await db
    .select({ id: user.id })
    .from(user)
    .where(eq(user.email, userEmail))
    .limit(1);

  if (!found) throw new Error(`User not found: ${userEmail}`);

  await db
    .delete(attendee)
    .where(and(eq(attendee.userId, found.id), eq(attendee.eventId, eventId)));
};

export const getAttendanceCounts = async (eventId: number) => {
  const rows = await db
    .select({
      going: sql<number>`count(case when ${attendee.status} = 'going' then 1 end)`.mapWith(Number),
      maybe: sql<number>`count(case when ${attendee.status} = 'maybe' then 1 end)`.mapWith(Number),
      not_going: sql<number>`count(case when ${attendee.status} = 'not_going' then 1 end)`.mapWith(Number),
    })
    .from(attendee)
    .where(eq(attendee.eventId, eventId));

  return rows[0] ?? { going: 0, maybe: 0, not_going: 0 };
};

export const getUserAttendanceStatus = async (
  userEmail: string,
  eventId: number
): Promise<AttendanceStatus | null> => {
  const [found] = await db
    .select({ id: user.id })
    .from(user)
    .where(eq(user.email, userEmail))
    .limit(1);

  if (!found) return null;

  const [row] = await db
    .select({ status: attendee.status })
    .from(attendee)
    .where(and(eq(attendee.userId, found.id), eq(attendee.eventId, eventId)))
    .limit(1);

  return (row?.status as AttendanceStatus) ?? null;
};
