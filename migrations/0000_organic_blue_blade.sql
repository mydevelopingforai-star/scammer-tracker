CREATE TABLE "captures" (
	"id" serial PRIMARY KEY NOT NULL,
	"link_id" integer NOT NULL,
	"ip_address" text,
	"user_agent" text,
	"latitude" text,
	"longitude" text,
	"accuracy" text,
	"image_data" text,
	"captured_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "tracking_links" (
	"id" serial PRIMARY KEY NOT NULL,
	"token" text NOT NULL,
	"name" text NOT NULL,
	"created_by_ip" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "tracking_links_token_unique" UNIQUE("token")
);
