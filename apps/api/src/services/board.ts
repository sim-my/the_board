
import { db } from "../db";
import { tag as tagsTable } from "../db/schema";

export const getTagsInDb = async () => {
    const tags = await db.select().from(tagsTable);
    return tags;
}