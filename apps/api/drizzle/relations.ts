import { relations } from "drizzle-orm/relations";
import { event, attendee, user } from "./schema";

export const attendeeRelations = relations(attendee, ({one}) => ({
	event: one(event, {
		fields: [attendee.eventId],
		references: [event.id]
	}),
	user: one(user, {
		fields: [attendee.userId],
		references: [user.id]
	}),
}));

export const eventRelations = relations(event, ({one, many}) => ({
	attendees: many(attendee),
	user: one(user, {
		fields: [event.creatorId],
		references: [user.id]
	}),
}));

export const userRelations = relations(user, ({many}) => ({
	attendees: many(attendee),
	events: many(event),
}));