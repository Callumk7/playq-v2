import type { IGDBClient } from "./igdb";
import { games, type GamesInsert } from "~/db/schema/games";
import { type GameSearchResult, IGDBGameSchema } from "~/schema/igdb";

export class DataSync {
	private gameIds: Set<number> = new Set();
	private completedGameIds: Set<number> = new Set();
	private igdbClient: IGDBClient;

	constructor(igdbClient: IGDBClient) {
		this.igdbClient = igdbClient;
	}

	addGameId(id: number) {
		this.gameIds.add(id);
	}

	private markIdAsCompleted(id: number) {
		if (this.gameIds.has(id)) {
			this.completedGameIds.add(id);
			this.gameIds.delete(id);
		}
	}

	async handleDataFetch(gameId: number) {
		console.log(`Fetching data for game ID: ${gameId}`);
		const gameData = await this.igdbClient.execute<GameSearchResult[]>(
			"games",
			this.igdbClient.games("complete").where(`id = ${gameId}`),
		);

		const game = gameData[0];
		const mappedGame = validateAndMapGame(game);
	}
}

export function validateAndMapGame(game: unknown): GamesInsert {
	const parseGameResult = IGDBGameSchema.safeParse(game);

	if (parseGameResult.success) {
		const parsedGame = parseGameResult.data;
		return {
			id: parsedGame.id,
			name: parsedGame.name,
			firstReleaseDate: parsedGame.first_release_date,
			rating: parsedGame.rating ? String(parsedGame.rating) : null,
			ratingCount: parsedGame.rating_count,
			coverImageId: parsedGame.cover?.image_id ?? "NO_COVER",
			ageRatings: parsedGame.age_ratings,
			aggregatedRating: parsedGame.aggregated_rating ? String(parsedGame.aggregated_rating) : null,
			aggregatedRatingCount: parsedGame.aggregated_rating_count,
			alternativeNames: parsedGame.alternative_names,
			artworks: parsedGame.artworks,
			bundles: parsedGame.bundles,
			checksum: parsedGame.checksum,
			collections: parsedGame.collections,
			dlcs: parsedGame.dlcs,
			expandedGames: parsedGame.expanded_games,
			expansions: parsedGame.expansions,
			externalGames: parsedGame.external_games,
			forks: parsedGame.forks,
			franchise: parsedGame.franchise,
			franchises: parsedGame.franchises,
			gameEngines: parsedGame.game_engines,
			gameLocalizations: parsedGame.game_localizations,
			gameModes: parsedGame.game_modes,
			gameStatus: parsedGame.game_status,
			gameType: parsedGame.game_type,
			genres: parsedGame.genres,
			hypes: parsedGame.hypes,
			involvedCompanies: parsedGame.involved_companies,
			keywords: parsedGame.keywords,
			languageSupports: parsedGame.language_supports,
			multiplayerModes: parsedGame.multiplayer_modes,
			parentGame: parsedGame.parent_game,
			platforms: parsedGame.platforms,
			playerPerspectives: parsedGame.player_perspectives,
			ports: parsedGame.ports,
			releaseDates: parsedGame.release_dates,
			remakes: parsedGame.remakes,
			remasters: parsedGame.remasters,
			screenshots: parsedGame.screenshots,
			similarGames: parsedGame.similar_games,
			slug: parsedGame.slug,
			standaloneExpansions: parsedGame.standalone_expansions,
			storyline: parsedGame.storyline,
			summary: parsedGame.summary,
			tags: parsedGame.tags,
			themes: parsedGame.themes,
			totalRating: parsedGame.total_rating ? String(parsedGame.total_rating) : null,
			url: parsedGame.url,
			versionParent: parsedGame.version_parent,
			videos: parsedGame.videos,
			websites: parsedGame.websites,
			updatedAt: parsedGame.updated_at ? new Date(parsedGame.updated_at) : undefined,
			createdAt: parsedGame.created_at ? new Date(parsedGame.created_at) : undefined,
		};
	}

	throw parseGameResult.error;
}
