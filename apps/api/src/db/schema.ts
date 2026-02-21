import { pgTable, varchar, timestamp, text, integer, uniqueIndex, boolean, index, foreignKey } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"



export const prismaMigrations = pgTable("_prisma_migrations", {
	id: varchar({ length: 36 }).primaryKey().notNull(),
	checksum: varchar({ length: 64 }).notNull(),
	finishedAt: timestamp("finished_at", { withTimezone: true, mode: 'string' }),
	migrationName: varchar("migration_name", { length: 255 }).notNull(),
	logs: text(),
	rolledBackAt: timestamp("rolled_back_at", { withTimezone: true, mode: 'string' }),
	startedAt: timestamp("started_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	appliedStepsCount: integer("applied_steps_count").default(0).notNull(),
});

export const user = pgTable("User", {
	email: text().primaryKey().notNull(),
	username: text().notNull(),
	name: text().notNull(),
	lastname: text().notNull(),
	alumni: boolean().default(false).notNull(),
	dateOfBirth: timestamp({ precision: 3, mode: 'string' }),
}, (table) => [
	uniqueIndex("User_username_key").using("btree", table.username.asc().nullsLast().op("text_ops")),
]);

export const oneTimePassword = pgTable("OneTimePassword", {
	id: text().primaryKey().notNull(),
	email: text().notNull(),
	code: text().notNull(),
	expiresAt: timestamp({ precision: 3, mode: 'string' }).notNull(),
	createdAt: timestamp({ precision: 3, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
}, (table) => [
	uniqueIndex("OneTimePassword_email_code_key").using("btree", table.email.asc().nullsLast().op("text_ops"), table.code.asc().nullsLast().op("text_ops")),
	index("OneTimePassword_email_idx").using("btree", table.email.asc().nullsLast().op("text_ops")),
]);

export const attendee = pgTable("Attendee", {
	id: text().primaryKey().notNull(),
	userId: text().notNull(),
	eventId: text().notNull(),
	createdAt: timestamp({ precision: 3, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
}, (table) => [
	uniqueIndex("Attendee_userId_eventId_key").using("btree", table.userId.asc().nullsLast().op("text_ops"), table.eventId.asc().nullsLast().op("text_ops")),
	foreignKey({
			columns: [table.eventId],
			foreignColumns: [event.id],
			name: "Attendee_eventId_fkey"
		}).onUpdate("cascade").onDelete("restrict"),
	foreignKey({
			columns: [table.userId],
			foreignColumns: [user.email],
			name: "Attendee_userId_fkey"
		}).onUpdate("cascade").onDelete("restrict"),
]);

export const event = pgTable("Event", {
	id: text().primaryKey().notNull(),
	posterUrl: text(),
	description: varchar({ length: 1500 }).notNull(),
	title: text().notNull(),
	date: timestamp({ precision: 3, mode: 'string' }).notNull(),
	affiliation: text(),
	tags: text().array(),
	creatorEmail: text().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.creatorEmail],
			foreignColumns: [user.email],
			name: "Event_creatorEmail_fkey"
		}).onUpdate("cascade").onDelete("restrict"),
]);
