import { Request, Response, NextFunction } from "express";
import { createEventInDb } from "../services/event";


export async function createEvent(req: Request, res: Response, next: NextFunction) {
    // I don't like that there is not validation here, but it's ok for now.
    const { title, description, date, affiliation, tags, creatorEmail, registrationDeadline} = req.body;
    const posterImage = req.file;


    const event = await createEventInDb({
        title,
        description,
        date,
        affiliation,
        tags,
        creatorId: creatorEmail,
        registrationDeadline,
        posterImage,
    });

    return res.json({ message: "Event created successfully!", event });
}

export async function fetchEvents(req: Request, res: Response, next: NextFunction) {

    // Event Query Params:
    const { tags, startDate, endDate, registrationDate } = req.query;

    

}