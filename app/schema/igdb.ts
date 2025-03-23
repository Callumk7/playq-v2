import { z } from "zod";

export const GameSearchResultSchema = z.object({
	id: z.number(),
	name: z.string(),
	cover: z.object({
		id: z.number(),
		image_id: z.string(),
	}),
});

export type GameSearchResult = z.infer<typeof GameSearchResultSchema>;

export const IGDBGameSchema = z.object({
	id: z.number(),
	name: z.string(),
	first_release_date: z.number().optional(),
	rating: z.number().optional(), // Average IGDB user rating
	rating_count: z.number().optional(), // Total number of IGDB user ratings
	cover: z
		.object({
			id: z.number(),
			image_id: z.string(),
		})
		.optional(),
	age_ratings: z.array(z.number()).optional(), // Array of Age Rating IDs
	aggregated_rating: z.number().optional(), // Rating based on external critic scores
	aggregated_rating_count: z.number().optional(), // Number of external critic scores
	alternative_names: z.array(z.number()).optional(), // Alternative Name IDs
	artworks: z.array(z.number()).optional(), // Artworks of this game
	bundles: z.array(z.number()).optional(), // Array of Game IDs
	created_at: z.number().optional(),
	checksum: z.string().optional(),
	collections: z.array(z.number()).optional(),
	dlcs: z.array(z.number()).optional(), // DLCs for this game
	expanded_games: z.array(z.number()).optional(), // Expanded games
	expansions: z.array(z.number()).optional(), // Expansions
	external_games: z.array(z.number()).optional(), // External Game IDs
	forks: z.array(z.number()).optional(), // Forks of this game
	franchise: z.number().optional(), // Reference ID for Franchise
	franchises: z.array(z.number()).optional(), // Other franchises
	game_engines: z.array(z.number()).optional(), // Game Engine IDs
	game_localizations: z.array(z.number()).optional(), // Game Localization IDs
	game_modes: z.array(z.number()).optional(), // Game Mode IDs
	game_status: z.number().optional(),
	game_type: z.number().optional(),
	genres: z.array(z.number()).optional(), // Genres of the game
	hypes: z.number().optional(), // Number of follows a game gets
	involved_companies: z.array(z.number()).optional(), // Companies who developed this game
	keywords: z.array(z.number()).optional(), // Associated keywords
	language_supports: z.array(z.number()).optional(), // Supported Languages
	multiplayer_modes: z.array(z.number()).optional(), // Multiplayer modes
	parent_game: z.number().optional(), // Reference ID for Game
	platforms: z.array(z.number()).optional(), // Platforms this game was released on
	player_perspectives: z.array(z.number()).optional(), // Player Perspective IDs
	ports: z.array(z.number()).optional(), // Ports of this game
	release_dates: z.array(z.number()).optional(), // Release Date IDs
	remakes: z.array(z.number()).optional(), // Remakes of this game
	remasters: z.array(z.number()).optional(), // Remasters of this game
	screenshots: z.array(z.number()).optional(), // Screenshots of this game
	similar_games: z.array(z.number()).optional(), // Similar games
	slug: z.string().optional(), // URL-safe, unique, lower-case version
	standalone_expansions: z.array(z.number()).optional(), // Standalone expansions
	storyline: z.string().optional(), // Short description of the story
	summary: z.string().optional(), // Description of the game
	tags: z.array(z.number()).optional(), // Related entities
	themes: z.array(z.number()).optional(), // Themes of the game
	total_rating: z.number().optional(), // Average rating
	total_rating_count: z.number().optional(), // Total number of ratings
	updated_at: z.number().optional(), // Last date updated
	url: z.string().optional(), // Website address
	version_parent: z.number().optional(), // Reference ID for Game
	version_title: z.string().optional(), // Title of this version
	videos: z.array(z.number()).optional(), // Game Video IDs
	websites: z.array(z.number()).optional(), // Websites associated with this game
});

export type IGDBImage =
	| "cover_small"
	| "screenshot_med"
	| "cover_big"
	| "logo_med"
	| "screenshot_big"
	| "screenshot_huge"
	| "thumb"
	| "micro"
	| "720p"
	| "1080p";
