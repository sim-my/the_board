import { db } from "../db";
import { event as eventsTable } from "../db/schema";
import { and, gte, lte, sql } from 'drizzle-orm';
import { nanoid } from "nanoid";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

interface CreateEventData {
  title: string;
  description: string;
  date: string;
  registrationDeadline: string;
  affiliation?: string;
  tags?: string[];
  creatorId: number;
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

  const newEvent = await db.insert(eventsTable).values({
    // id: nanoid(),
    title: eventData.title,
    description: eventData.description,
    date: eventData.date,
    registrationDeadline: eventData.registrationDeadline,
    affiliation: eventData.affiliation || null,
    tags: eventData.tags || [],
    creatorId: eventData.creatorId,
    posterUrl: posterUrl,
  }).returning();

  return newEvent[0];
};

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
    .select()
    .from(eventsTable)
    .where(conditions.length > 0 ? and(...conditions) : undefined);
};
