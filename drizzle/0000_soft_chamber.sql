CREATE TABLE "account" (
	"id" text PRIMARY KEY NOT NULL,
	"account_id" text NOT NULL,
	"provider_id" text NOT NULL,
	"user_id" text NOT NULL,
	"access_token" text,
	"refresh_token" text,
	"id_token" text,
	"access_token_expires_at" timestamp,
	"refresh_token_expires_at" timestamp,
	"scope" text,
	"password" text,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "session" (
	"id" text PRIMARY KEY NOT NULL,
	"expires_at" timestamp NOT NULL,
	"token" text NOT NULL,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL,
	"ip_address" text,
	"user_agent" text,
	"user_id" text NOT NULL,
	CONSTRAINT "session_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE "user" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"email_verified" boolean NOT NULL,
	"image" text,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL,
	CONSTRAINT "user_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "verification" (
	"id" text PRIMARY KEY NOT NULL,
	"identifier" text NOT NULL,
	"value" text NOT NULL,
	"expires_at" timestamp NOT NULL,
	"created_at" timestamp,
	"updated_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "users_to_games" (
	"user_id" text NOT NULL,
	"game_id" integer NOT NULL,
	CONSTRAINT "users_to_games_user_id_game_id_pk" PRIMARY KEY("user_id","game_id")
);
--> statement-breakpoint
CREATE TABLE "basic_games" (
	"id" integer PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"first_release_date" integer NOT NULL,
	"rating" numeric NOT NULL,
	"rating_count" integer NOT NULL,
	"cover_image_id" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "games" (
	"id" integer PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"first_release_date" integer,
	"rating" numeric,
	"rating_count" integer,
	"cover_image_id" text,
	"age_ratings" integer[],
	"aggregated_rating" numeric,
	"aggregated_rating_count" integer,
	"alternative_names" integer[],
	"artworks" integer[],
	"bundles" integer[],
	"checksum" uuid,
	"collections" integer[],
	"dlcs" integer[],
	"expanded_games" integer[],
	"expansions" integer[],
	"external_games" integer[],
	"forks" integer[],
	"franchise" integer,
	"franchises" integer[],
	"game_engines" integer[],
	"game_localizations" integer[],
	"game_modes" integer[],
	"game_status" integer,
	"game_type" integer,
	"genres" integer[],
	"hypes" integer,
	"involved_companies" integer[],
	"keywords" integer[],
	"language_supports" integer[],
	"multiplayer_modes" integer[],
	"parent_game" integer,
	"platforms" integer[],
	"player_perspectives" integer[],
	"ports" integer[],
	"release_dates" integer[],
	"remakes" integer[],
	"remasters" integer[],
	"screenshots" integer[],
	"similar_games" integer[],
	"slug" text,
	"standalone_expansions" integer[],
	"storyline" text,
	"summary" text,
	"tags" integer[],
	"themes" integer[],
	"total_rating" numeric,
	"url" text,
	"version_parent" integer,
	"videos" integer[],
	"websites" integer[],
	"updated_at" timestamp,
	"created_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "games_to_playlists" (
	"game_id" integer NOT NULL,
	"playlist_id" uuid NOT NULL,
	CONSTRAINT "games_to_playlists_game_id_playlist_id_pk" PRIMARY KEY("game_id","playlist_id")
);
--> statement-breakpoint
CREATE TABLE "playlists" (
	"id" uuid PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"creator_id" text NOT NULL,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL,
	"is_private" boolean DEFAULT true NOT NULL
);
--> statement-breakpoint
ALTER TABLE "account" ADD CONSTRAINT "account_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "session" ADD CONSTRAINT "session_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "users_to_games" ADD CONSTRAINT "users_to_games_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "users_to_games" ADD CONSTRAINT "users_to_games_game_id_games_id_fk" FOREIGN KEY ("game_id") REFERENCES "public"."games"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "games_to_playlists" ADD CONSTRAINT "games_to_playlists_game_id_games_id_fk" FOREIGN KEY ("game_id") REFERENCES "public"."games"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "games_to_playlists" ADD CONSTRAINT "games_to_playlists_playlist_id_playlists_id_fk" FOREIGN KEY ("playlist_id") REFERENCES "public"."playlists"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "playlists" ADD CONSTRAINT "playlists_creator_id_user_id_fk" FOREIGN KEY ("creator_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;