-- Current sql file was generated after introspecting the database
-- If you want to run this migration please uncomment this code before executing migrations
/*
CREATE TABLE "_prisma_migrations" (
	"id" varchar(36) PRIMARY KEY NOT NULL,
	"checksum" varchar(64) NOT NULL,
	"finished_at" timestamp with time zone,
	"migration_name" varchar(255) NOT NULL,
	"logs" text,
	"rolled_back_at" timestamp with time zone,
	"started_at" timestamp with time zone DEFAULT now() NOT NULL,
	"applied_steps_count" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
ALTER TABLE "_prisma_migrations" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "User" (
	"email" text PRIMARY KEY NOT NULL,
	"username" text NOT NULL,
	"name" text NOT NULL,
	"lastname" text NOT NULL,
	"alumni" boolean DEFAULT false NOT NULL,
	"dateOfBirth" timestamp(3)
);
--> statement-breakpoint
ALTER TABLE "User" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "OneTimePassword" (
	"id" text PRIMARY KEY NOT NULL,
	"email" text NOT NULL,
	"code" text NOT NULL,
	"expiresAt" timestamp(3) NOT NULL,
	"createdAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
ALTER TABLE "OneTimePassword" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "Attendee" (
	"id" text PRIMARY KEY NOT NULL,
	"userId" text NOT NULL,
	"eventId" text NOT NULL,
	"createdAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
ALTER TABLE "Attendee" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "Event" (
	"id" text PRIMARY KEY NOT NULL,
	"posterUrl" text,
	"description" varchar(1500) NOT NULL,
	"title" text NOT NULL,
	"date" timestamp(3) NOT NULL,
	"affiliation" text,
	"tags" text[],
	"creatorEmail" text NOT NULL
);
--> statement-breakpoint
ALTER TABLE "Event" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "Attendee" ADD CONSTRAINT "Attendee_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "public"."Event"("id") ON DELETE restrict ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "Attendee" ADD CONSTRAINT "Attendee_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("email") ON DELETE restrict ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "Event" ADD CONSTRAINT "Event_creatorEmail_fkey" FOREIGN KEY ("creatorEmail") REFERENCES "public"."User"("email") ON DELETE restrict ON UPDATE cascade;--> statement-breakpoint
CREATE UNIQUE INDEX "User_username_key" ON "User" USING btree ("username" text_ops);--> statement-breakpoint
CREATE UNIQUE INDEX "OneTimePassword_email_code_key" ON "OneTimePassword" USING btree ("email" text_ops,"code" text_ops);--> statement-breakpoint
CREATE INDEX "OneTimePassword_email_idx" ON "OneTimePassword" USING btree ("email" text_ops);--> statement-breakpoint
CREATE UNIQUE INDEX "Attendee_userId_eventId_key" ON "Attendee" USING btree ("userId" text_ops,"eventId" text_ops);
*/