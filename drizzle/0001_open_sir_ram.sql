CREATE TABLE "genres" (
	"id" integer PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"is_updated" boolean DEFAULT false NOT NULL,
	CONSTRAINT "genres_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "genres_to_games" (
	"genre_id" integer NOT NULL,
	"game_id" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"is_updated" boolean DEFAULT false NOT NULL
);
--> statement-breakpoint
ALTER TABLE "playlist_permissions" ADD PRIMARY KEY ("permission_id");--> statement-breakpoint
ALTER TABLE "playlist_permissions" ALTER COLUMN "permission_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "playlist_permissions" ALTER COLUMN "playlist_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "playlist_permissions" ALTER COLUMN "user_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "playlist_permissions" ALTER COLUMN "roleType" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "playlists" ALTER COLUMN "privacySetting" SET NOT NULL;