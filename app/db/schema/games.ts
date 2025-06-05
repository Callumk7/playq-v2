import { integer, numeric, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { usersToGames } from "./collection";
import { relations } from "drizzle-orm";
import { createInsertSchema } from 'drizzle-zod';
import type { z } from "zod";
import { gamesToPlaylists } from "./playlists";
import { genresToGames } from "./genres";

export const basicGames = pgTable("basic_games", {
	id: integer("id").primaryKey(),
	name: text("name").notNull(),
	firstReleaseDate: integer("first_release_date").notNull(),
	rating: numeric("rating").notNull(),
	ratingCount: integer("rating_count").notNull(),
	coverImageId: text("cover_image_id").notNull(),
});

export const games = pgTable("games", {
	id: integer("id").primaryKey(),
	name: text("name").notNull(),
	firstReleaseDate: integer("first_release_date"),
	rating: numeric("rating"),
	ratingCount: integer("rating_count"),
	coverImageId: text("cover_image_id"),
	// Full data:
	ageRatings: integer("age_ratings").array(),
	aggregatedRating: numeric("aggregated_rating"),
	aggregatedRatingCount: integer("aggregated_rating_count"),
	alternativeNames: integer("alternative_names").array(),
	artworks: integer("artworks").array(),
	bundles: integer("bundles").array(),
	checksum: uuid("checksum"),
	collections: integer("collections").array(),
	dlcs: integer("dlcs").array(),
	expandedGames: integer("expanded_games").array(),
	expansions: integer("expansions").array(),
	externalGames: integer("external_games").array(), // IDs for this game on other platforms
	forks: integer("forks").array(),
	franchise: integer("franchise"),
	franchises: integer("franchises").array(),
	gameEngines: integer("game_engines").array(),
	gameLocalizations: integer("game_localizations").array(),
	gameModes: integer("game_modes").array(),
	gameStatus: integer("game_status"),
	gameType: integer("game_type"),
	genres: integer("genres").array(),
	hypes: integer("hypes"),
	involvedCompanies: integer("involved_companies").array(),
	keywords: integer("keywords").array(),
	languageSupports: integer("language_supports").array(),
	multiplayerModes: integer("multiplayer_modes").array(),
	parentGame: integer("parent_game"),
	platforms: integer("platforms").array(),
	playerPerspectives: integer("player_perspectives").array(),
	ports: integer("ports").array(),
	releaseDates: integer("release_dates").array(),
	remakes: integer("remakes").array(),
	remasters: integer("remasters").array(),
	screenshots: integer("screenshots").array(),
	similarGames: integer("similar_games").array(),
	slug: text("slug"),
	standaloneExpansions: integer("standalone_expansions").array(),
	storyline: text("storyline"),
	summary: text("summary"),
	tags: integer("tags").array(),
	themes: integer("themes").array(),
	totalRating: numeric("total_rating"),
	url: text("url"),
	versionParent: integer("version_parent"),
	videos: integer("videos").array(),
	websites: integer("websites").array(),
	updatedAt: timestamp("updated_at", { mode: "date" }),
	createdAt: timestamp("created_at", { mode: "date" }),
});

export const gamesRelations = relations(games, ({ many }) => ({
	users: many(usersToGames),
	playlists: many(gamesToPlaylists),
	genresInternal: many(genresToGames),
}));

export const gamesInsertSchema = createInsertSchema(games);
export type GamesInsert = z.infer<typeof gamesInsertSchema>;
