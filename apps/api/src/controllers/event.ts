import { Request, Response, NextFunction } from "express";
import { createEventInDb, getEventByIdInDb, fetchEvents as fetchEventsFromDb } from "../services/event";


export async function createEvent(req: Request, res: Response, next: NextFunction) {
    // I don't like that there is not validation here, but it's ok for now.
    const { title, description, date, affiliation, tags, creatorEmail,registrationDeadline} = req.body;
    const posterImage = req.file;
    console.log(req.body);

    const tagsArray: string[] =
      typeof req.body.tags === "string"
        ? req.body.tags.split(",").map((t: string) => t.trim())
        : [];

    const event = await createEventInDb({
        title,
        description,
        date,
        affiliation,
        tagsArray,
        creatorEmail,
        registrationDeadline,
        posterImage
    });

    return res.json({ message: "Event created successfully!", event });
}


export async function getEvents(req: Request, res: Response, next: NextFunction) {
    const { tags, startDate, endDate, registrationDeadline } = req.query;

    const tagsArray = tags
        ? (tags as string).split(",").map((t) => t.trim()).filter(Boolean)
        : undefined;

    const events = await fetchEventsFromDb(
        tagsArray,
        startDate as string | undefined,
        endDate as string | undefined,
        registrationDeadline as string | undefined,
    );

    return res.json({ events });
}

export async function getEventById(req: Request, res: Response, next: NextFunction) {
    const {id} = req.params;
    const event = await getEventByIdInDb(id as string);
    return res.json({ event });
}
