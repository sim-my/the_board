import { db } from "../db";
import { event as eventsTable, user as userTable, attendee } from "../db/schema";
import { eq, and, gte, lte, sql } from "drizzle-orm";
import { nanoid } from "nanoid";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

interface CreateEventData {
  title: string;
  description: string;
  date: string;
  registrationDeadline: string;
  affiliation?: string;
  tagsArray?: string[];
  creatorEmail: string;
  posterImage?: Express.Multer.File;
}

export const createEventInDb = async (eventData: CreateEventData) => {

  let posterUrl: string | null = null;

  if (eventData.posterImage) {
    const fileName = `${nanoid()}.${eventData.posterImage.mimetype.split('/')[1]}`;
    const { data, error } = await supabase.storage
      .from("event-posters-public")
      .upload(fileName, eventData.posterImage.buffer, {
        contentType: eventData.posterImage.mimetype,
      });

    if (error) {
      throw new Error(`Failed to upload poster: ${error.message}`);
    }

    const { data: urlData } = supabase.storage
      .from("event-posters-public")
      .getPublicUrl(fileName);
    
    posterUrl = urlData.publicUrl;
  }


  

  try {
    const [creator] = await db
      .select({ id: userTable.id })
      .from(userTable)
      .where(eq(userTable.email, eventData.creatorEmail))
      .limit(1);

    if (!creator) {
      throw new Error(`User not found: ${eventData.creatorEmail}`);
    }

    const newEvent = await db.insert(eventsTable).values({
      title: eventData.title,
      description: eventData.description,
      date: eventData.date,
      affiliation: eventData.affiliation || null,
      tags: eventData.tagsArray || [],
      creatorId: creator.id,
      posterUrl: posterUrl,
      registrationDeadline: eventData.registrationDeadline,
    }).returning();

    return newEvent[0];
  } catch (err: unknown) {
    const cause = err instanceof Error && "cause" in err ? (err as Error & { cause?: Error }).cause : null;
    const pgMessage = cause instanceof Error ? cause.message : null;
    const pgCode = cause && typeof cause === "object" && "code" in cause ? (cause as { code?: string }).code : null;
    const message = pgMessage || (err instanceof Error ? err.message : String(err));
    throw new Error(`Failed to create event${pgCode ? ` [${pgCode}]` : ""}: ${message}`);
  }
};

export const getEventsInDb = async () => {
  const events = await db.select().from(eventsTable);
  return events;
}

export const getEventByIdInDb = async (id: string) => {
  const event = await db.select().from(eventsTable).where(eq(eventsTable.id, parseInt(id)));
  return event;
}

export const fetchEvents = async (tags?: string[], startDate?: string, endDate?: string, registrationDeadline?: string) => {
  const conditions = [];

  if (tags && tags.length > 0) {
    conditions.push(sql`${eventsTable.tags} && ARRAY[${sql.join(tags.map((t) => sql`${t}`), sql`, `)}]::text[]`);
  }

  if (startDate) {
    conditions.push(gte(eventsTable.date, startDate));
  }

  if (endDate) {
    conditions.push(lte(eventsTable.date, endDate));
  }

  if (registrationDeadline) {
    conditions.push(gte(eventsTable.registrationDeadline, registrationDeadline));
  }

  return db
    .select({
      id: eventsTable.id,
      title: eventsTable.title,
      posterUrl: eventsTable.posterUrl,
      description: eventsTable.description,
      date: eventsTable.date,
      affiliation: eventsTable.affiliation,
      tags: eventsTable.tags,
      creatorId: eventsTable.creatorId,
      registrationDeadline: eventsTable.registrationDeadline,
      going: sql<number>`count(case when ${attendee.status} = 'going' then 1 end)`.mapWith(Number),
      maybe: sql<number>`count(case when ${attendee.status} = 'maybe' then 1 end)`.mapWith(Number),
      not_going: sql<number>`count(case when ${attendee.status} = 'not_going' then 1 end)`.mapWith(Number),
    })
    .from(eventsTable)
    .leftJoin(attendee, eq(attendee.eventId, eventsTable.id))
    .where(conditions.length > 0 ? and(...conditions) : undefined)
    .groupBy(eventsTable.id);
};
