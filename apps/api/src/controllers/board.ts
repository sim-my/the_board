
import { Request, Response, NextFunction } from "express";
import { getTagsInDb} from "../services/board";



export async function getTags(req: Request, res: Response, next: NextFunction) {
    const tags = await getTagsInDb();
    return res.json({ tags });
}