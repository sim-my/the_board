import { db } from "../db";
import { event as eventsTable, user as userTable } from "../db/schema";
import { eq } from "drizzle-orm";
import { nanoid } from "nanoid";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

interface CreateEventData {
  title: string;
  description: string;
  date: string;
  affiliation?: string;
  tagsArray?: string[];
  creatorEmail: string;
  posterImage?: Express.Multer.File;
  registrationDeadline: string;
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

