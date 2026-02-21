import {
  pgTable,
  uniqueIndex,
  foreignKey,
  integer,
  timestamp,
  index,
  text,
  varchar,
  unique,
  boolean,
  pgPolicy,
  bigint,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

export const prismaMigrations = pgTable("_prisma_migrations", {
  id: varchar({ length: 36 }).primaryKey().notNull(),
  checksum: varchar({ length: 64 }).notNull(),
  finishedAt: timestamp("finished_at", { withTimezone: true, mode: "string" }),
  migrationName: varchar("migration_name", { length: 255 }).notNull(),
  logs: text(),
  rolledBackAt: timestamp("rolled_back_at", {
    withTimezone: true,
    mode: "string",
  }),
  startedAt: timestamp("started_at", { withTimezone: true, mode: "string" })
    .defaultNow()
    .notNull(),
  appliedStepsCount: integer("applied_steps_count").default(0).notNull(),
});

export const user = pgTable(
  "User",
  {
    id: integer().primaryKey().generatedAlwaysAsIdentity({ startWith: 1000 }),
    email: text().notNull(),
    username: text(),
    name: text(),
    lastname: text(),
    alumni: boolean().default(false),
    dateOfBirth: timestamp({ precision: 3, mode: "string" }),
  },
  (table) => [
    uniqueIndex("User_username_key").using(
      "btree",
      table.username.asc().nullsLast().op("text_ops")
    ),
    unique("User_email_unique").on(table.email),
  ]
);

export const oneTimePassword = pgTable(
  "OneTimePassword",
  {
    id: integer().primaryKey().generatedAlwaysAsIdentity({ startWith: 1000 }),
    email: text().notNull(),
    code: text().notNull(),
    expiresAt: timestamp({ precision: 3, mode: "string" }).notNull(),
    createdAt: timestamp({ precision: 3, mode: "string" })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
  },
  (table) => [
    uniqueIndex("OneTimePassword_email_code_key").using(
      "btree",
      table.email.asc().nullsLast().op("text_ops"),
      table.code.asc().nullsLast().op("text_ops")
    ),
    index("OneTimePassword_email_idx").using(
      "btree",
      table.email.asc().nullsLast().op("text_ops")
    ),
  ]
);

export const event = pgTable(
  "Event",
  {
    id: integer().primaryKey().generatedAlwaysAsIdentity({ startWith: 1000 }),
    posterUrl: text(),
    description: varchar({ length: 1500 }).notNull(),
    title: text().notNull(),
    date: timestamp({ precision: 3, mode: "string" }).notNull(),
    affiliation: text(),
    tags: text().array(),
    creatorId: integer().notNull(),
    registrationDeadline: timestamp({ precision: 3, mode: "string" }),
  },
  (table) => [
    foreignKey({
      columns: [table.creatorId],
      foreignColumns: [user.id],
      name: "Event_creatorId_fkey",
    })
      .onUpdate("cascade")
      .onDelete("restrict"),
    pgPolicy("Allow insert on Event", {
      as: "permissive",
      for: "insert",
      to: ["public"],
      withCheck: sql`true`,
    }),
  ]
);

export const attendee = pgTable(
  "Attendee",
  {
    id: integer().primaryKey().generatedAlwaysAsIdentity({ startWith: 1000 }),
    userId: integer().notNull(),
    eventId: integer().notNull(),
    createdAt: timestamp({ precision: 3, mode: "string" })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
  },
  (table) => [
    uniqueIndex("Attendee_userId_eventId_key").using(
      "btree",
      table.userId.asc().nullsLast().op("int4_ops"),
      table.eventId.asc().nullsLast().op("int4_ops")
    ),
    foreignKey({
      columns: [table.eventId],
      foreignColumns: [event.id],
      name: "Attendee_eventId_fkey",
    })
      .onUpdate("cascade")
      .onDelete("restrict"),
    foreignKey({
      columns: [table.userId],
      foreignColumns: [user.id],
      name: "Attendee_userId_fkey",
    })
      .onUpdate("cascade")
      .onDelete("restrict"),
  ]
);

export const tag = pgTable("Tag", {
  id: bigint({ mode: "number" }).primaryKey().generatedByDefaultAsIdentity(),
  name: varchar(),
});
