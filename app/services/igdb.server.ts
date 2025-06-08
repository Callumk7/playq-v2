import { betterFetch } from "@better-fetch/fetch";
import { z, type ZodSchema } from "zod";
import { env } from "~/lib/env";
import { IGDBGameSchema } from "~/schema/igdb";

async function fetchFromIGDB<T>(args: {
	endpoint: string;
	query: string;
	schema: ZodSchema<T>;
}): Promise<T> {
	const result = await betterFetch(`${env.API_GATEWAY_URL}/${args.endpoint}`, {
		method: "POST",
		headers: {
			"x-api-key": env.API_GATEWAY_KEY,
			Accept: "application/json",
			"Content-Type": "text/plain",
		},
		body: args.query,
		output: args.schema,
	});

	if (result.error) {
		console.error(
			`Failed to fetch from IGDB, status: ${result.error.status}, message: ${result.error.message}`,
		);
		throw result.error;
	}

	return result.data;
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
		return query;
	}
}

export async function getTopGames() {
	const queryBuilder = new QueryBuilder().selectPreset("default");
	const query = queryBuilder
		.select(
			"total_rating",
			"total_rating_count",
			"rating_count",
			"first_release_date",
		)
		.where("total_rating_count > 100")
		.where("parent_game = null")
		.sort("rating", "desc")
		.limit(100)
		.build();

	return await fetchFromIGDB({
		endpoint: "games",
		query,
		schema: IGDBGameSchema.array(),
	});
}

export async function getHypedGames() {
	const queryBuilder = new QueryBuilder().selectPreset("default");
	const query = queryBuilder
		.select(
			"total_rating",
			"total_rating_count",
			"rating_count",
			"hypes",
			"first_release_date",
		)
		.where("hypes > 50")
		.where("parent_game = null")
		.sort("hypes", "desc")
		.limit(100)
		.build();

	return await fetchFromIGDB({
		endpoint: "games",
		query,
		schema: IGDBGameSchema.array(),
	});
}

export async function getAllGenres() {
	return await fetchFromIGDB({
		endpoint: "genres",
		query: "fields name; limit 100;",
		schema: z.array(z.object({ id: z.number(), name: z.string() })),
	});
}

export async function GetTopGamesByGenre(genreId: number) {
	const queryBuilder = new QueryBuilder().selectPreset("default");
	const query = queryBuilder
		.select(
			"total_rating",
			"total_rating_count",
			"rating_count",
			"first_release_date",
		)
		.where("total_rating_count > 100")
		.where(`genres = (${genreId})`)
		.sort("rating", "desc")
		.limit(100)
		.build();
	return await fetchFromIGDB({
		endpoint: "games",
		query,
		schema: IGDBGameSchema.array(),
	});
}

export async function getFullGame(gameId: number) {
	const queryBuilder = new QueryBuilder().selectPreset("complete");
	const query = queryBuilder.where(`id = ${gameId}`).build();
	return await fetchFromIGDB({
		endpoint: "games",
		query,
		schema: IGDBGameSchema.array(),
	});
}

export async function getSearchResults(term: string, page: string | null) {
	const limit = 25;
	let offset: number | null = null;

	if (page === null) {
		offset = 0;
	} else {
		offset = Number(page) * limit;
	}

	const queryBuilder = new QueryBuilder().selectPreset("complete");
	const query = queryBuilder.search(term).limit(limit).offset(offset).build();

	return await fetchFromIGDB({
		endpoint: "games",
		query,
		schema: IGDBGameSchema.array(),
	});
}

export async function getGameIdsFromSteamIds(steamIds: number[]) {
	const idsAsString = `(${steamIds.join(",")})`;
	const result = await fetchFromIGDB({
		endpoint: "external_games",
		query: `fields game; where uid = ${idsAsString} & external_game_source = 1; limit 100;`,
		schema: z.array(
			z.object({
				id: z.number(),
				game: z.number(),
			}),
		),
	});

	return result.map((row) => row.game);
}
