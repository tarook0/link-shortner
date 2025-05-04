CREATE TABLE "urls" (
	"id" serial PRIMARY KEY NOT NULL,
	"original_url" text NOT NULL,
	"short_code" varchar(50) NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"clicks" integer DEFAULT 0 NOT NULL,
	"last_accessed" timestamp with time zone,
	CONSTRAINT "urls_short_code_unique" UNIQUE("short_code")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "idx_short_code" ON "urls" USING btree ("short_code");