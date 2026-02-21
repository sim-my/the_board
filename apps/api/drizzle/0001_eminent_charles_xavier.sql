ALTER TABLE "Attendee" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "Event" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "OneTimePassword" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "_prisma_migrations" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "User" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "Event" RENAME COLUMN "creatorEmail" TO "creatorId";--> statement-breakpoint
ALTER TABLE "Attendee" DROP CONSTRAINT "Attendee_userId_fkey";
--> statement-breakpoint
ALTER TABLE "Event" DROP CONSTRAINT "Event_creatorEmail_fkey";
--> statement-breakpoint
DROP INDEX "Attendee_userId_eventId_key";--> statement-breakpoint
/* 
    Unfortunately in current drizzle-kit version we can't automatically get name for primary key.
    We are working on making it available!

    Meanwhile you can:
        1. Check pk name in your database, by running
            SELECT constraint_name FROM information_schema.table_constraints
            WHERE table_schema = 'public'
                AND table_name = 'User'
                AND constraint_type = 'PRIMARY KEY';
        2. Uncomment code below and paste pk name manually
        
    Hope to release this update as soon as possible
*/

-- ALTER TABLE "User" DROP CONSTRAINT "<constraint_name>";--> statement-breakpoint
ALTER TABLE "User" ALTER COLUMN "username" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "User" ALTER COLUMN "name" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "User" ALTER COLUMN "lastname" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "User" ALTER COLUMN "alumni" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "OneTimePassword" ALTER COLUMN "id" SET DATA TYPE integer;--> statement-breakpoint
ALTER TABLE "OneTimePassword" ALTER COLUMN "id" ADD GENERATED ALWAYS AS IDENTITY (sequence name "OneTimePassword_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1000 CACHE 1);--> statement-breakpoint
ALTER TABLE "Attendee" ALTER COLUMN "id" SET DATA TYPE integer;--> statement-breakpoint
ALTER TABLE "Attendee" ALTER COLUMN "id" ADD GENERATED ALWAYS AS IDENTITY (sequence name "Attendee_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1000 CACHE 1);--> statement-breakpoint
ALTER TABLE "Attendee" ALTER COLUMN "userId" SET DATA TYPE integer;--> statement-breakpoint
ALTER TABLE "Attendee" ALTER COLUMN "eventId" SET DATA TYPE integer;--> statement-breakpoint
ALTER TABLE "Event" ALTER COLUMN "id" SET DATA TYPE integer;--> statement-breakpoint
ALTER TABLE "Event" ALTER COLUMN "id" ADD GENERATED ALWAYS AS IDENTITY (sequence name "Event_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1000 CACHE 1);--> statement-breakpoint
ALTER TABLE "User" ADD COLUMN "id" integer PRIMARY KEY NOT NULL GENERATED ALWAYS AS IDENTITY (sequence name "User_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1000 CACHE 1);--> statement-breakpoint
ALTER TABLE "Attendee" ADD CONSTRAINT "Attendee_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE restrict ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "Event" ADD CONSTRAINT "Event_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "public"."User"("id") ON DELETE restrict ON UPDATE cascade;--> statement-breakpoint
CREATE UNIQUE INDEX "Attendee_userId_eventId_key" ON "Attendee" USING btree ("userId" int4_ops,"eventId" int4_ops);--> statement-breakpoint
ALTER TABLE "User" ADD CONSTRAINT "User_email_unique" UNIQUE("email");