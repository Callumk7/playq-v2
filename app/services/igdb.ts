////////////////////////////////////////////////////////////////////////////////
//                           IGDB TYPESCRIPT SDK
////////////////////////////////////////////////////////////////////////////////

import { env } from "~/lib/env";
import { GameSearchResultSchema, IGDBGameSchema } from "~/schema/igdb";

const IGDB_BASE_URL = "https://api.igdb.com/v4";

class IGDBClient {
	private baseUrl: string = IGDB_BASE_URL;
	private clientId: string;
	private accessToken: string;

	constructor(clientId: string, accessToken: string) {
		this.clientId = clientId;
		this.accessToken = accessToken;
	}

	games(
		preset: "full" | "default" | "complete" | "none" | "fullGame" = "default",
	): QueryBuilder {
		return new QueryBuilder().selectPreset(preset);
	}

	async execute<T>(endpoint: string, queryBuilder: QueryBuilder): Promise<T> {
		const query = queryBuilder.build();
		const response = await fetch(`${this.baseUrl}/${endpoint}`, {
			method: "POST",
			headers: {
				"Client-ID": this.clientId,
				Authorization: `Bearer ${this.accessToken}`,
				Accept: "application/json",
				"Content-Type": "text/plain",
			},
			body: query,
		});

		if (!response.ok) {
			const error = await response.json();
			throw new Error(error.message);
		}

		return await response.json();
	}
}

class APIClient {
	private baseUrl: string;
	private apikey: string;

	constructor(apikey: string, baseUrl: string) {
		this.apikey = apikey;
		this.baseUrl = baseUrl;
	}

	games(
		preset: "full" | "default" | "complete" | "none" | "fullGame" = "default",
	): QueryBuilder {
		return new QueryBuilder().selectPreset(preset);
	}

	async execute<T>(endpoint: string, queryBuilder: QueryBuilder): Promise<T> {
		const query = queryBuilder.build();
		const response = await fetch(`${this.baseUrl}/${endpoint}`, {
			method: "POST",
			headers: {
				"x-api-key": this.apikey,
				Accept: "application/json",
				"Content-Type": "text/plain",
			},
			body: query,
		});

		if (!response.ok) {
			const error = await response.json();
			throw new Error(error.message);
		}

		return await response.json();
	}
}


class QueryBuilder {
	private fields: string[] = [];
	private whereConditions: string[] = [];
	private searchTerm: string | null = null;
	private sortOptions: string[] = [];
	private limitValue: number | null = null;
	private offsetValue: number | null = null;

	private readonly presetSelections = {
		full: [
			"name",
			"artworks.image_id",
			"screenshots.image_id",
			"aggregated_rating",
			"aggregated_rating_count",
			"cover.image_id",
			"storyline",
			"first_release_date",
			"genres.name",
			"follows",
			"involved_companies",
			"rating",
		],
		default: ["name", "cover.image_id", "rating", "first_release_date"],
		complete: ["*, cover.image_id"],
		none: [],
		fullGame: [
			"*",
			"artworks.image_id",
			"screenshots.image_id",
			"cover.image_id",
			"genres.name",
			"external_games.*",
			"related_games.*",
		],
	};

	selectPreset(
		preset: "full" | "default" | "complete" | "none" | "fullGame" = "default",
	): QueryBuilder {
		this.fields = [...this.presetSelections[preset]];
		return this;
	}

	select(...fields: string[]): QueryBuilder {
		this.fields.push(...fields);
		return this;
	}

	where(condition: string): QueryBuilder {
		this.whereConditions.push(condition);
		return this;
	}

	search(searchTerm: string | null): QueryBuilder {
		this.searchTerm = searchTerm;
		return this;
	}

	sort(field: string, order: "asc" | "desc" = "asc"): QueryBuilder {
		this.sortOptions.push(`${field} ${order}`);
		return this;
	}

	limit(value: number | null): QueryBuilder {
		this.limitValue = value;
		return this;
	}

	offset(value: number | null): QueryBuilder {
		this.offsetValue = value;
		return this;
	}

	build(): string {
		let query = "";
		if (this.searchTerm) {
			query += ` search "${this.searchTerm}";`;
		}
		if (this.fields.length > 0) {
			query += `fields ${this.fields.join(", ")};`;
		}
		if (this.whereConditions.length > 0) {
			query += ` where ${this.whereConditions.join(" & ")};`;
		}
		if (this.sortOptions.length > 0 && this.searchTerm === null) {
			query += ` sort ${this.sortOptions.join(", ")};`;
		}
		if (this.limitValue !== null) {
			query += ` limit ${this.limitValue};`;
		}
		if (this.offsetValue !== null) {
			query += ` offset ${this.offsetValue};`;
		}
		console.log(query);
		return query;
	}
}

////////////////////////////////////////////////////////////////////////////////
//                                Static Functions
////////////////////////////////////////////////////////////////////////////////

//const client = new IGDBClient(env.IGDB_CLIENT_ID, env.IGDB_BEARER_TOKEN);
const client = new APIClient(env.API_GATEWAY_KEY, env.API_GATEWAY_URL);

export async function getTopRatedRecentGames() {
	const games = await client.execute<unknown[]>(
		"games",
		client
			.games("default")
			.select("rating_count", "first_release_date")
			.where("rating_count >= 150")
			.where("parent_game = null")
			.sort("rating", "desc")
			.limit(100),
	);

	// TODO: There is no error handling for responses in an incorrect state
	const parsedResults = [];
	for (const game of games) {
		const result = GameSearchResultSchema.safeParse(game);
		if (result.success) {
			parsedResults.push(result.data);
		}
	}

	return parsedResults;
}

export async function getSearchResults(query: string | null, page: string | null) {
	const limit = 25;
	let offset: number | null = null;

	if (page === null) {
		offset = 0;
	} else {
		offset = Number(page) * limit;
	}

	const games = await client.execute<unknown[]>(
		"games",
		client.games("default").search(query).limit(limit).offset(offset),
	);

	const parsedResults = [];
	for (const game of games) {
		const result = IGDBGameSchema.safeParse(game);
		if (result.success) {
			parsedResults.push(result.data);
		}
	}

	return parsedResults;
}

export async function getFullGame(gameId: number) {
	const results = await client.execute<unknown[]>(
		"games",
		client.games("fullGame").where(`id = ${gameId}`),
	);

	const result = IGDBGameSchema.safeParse(results[0]);

	if (result.success) {
		return result.data;
	}

	throw new Error("Failed to parse game");
}

