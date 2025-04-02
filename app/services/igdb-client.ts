import { GameSearchResultSchema } from "~/schema/igdb";

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

export async function clientGetMostPlayed(url: string, apiKey: string) {
	const client = new APIClient(apiKey, url);

	const results = await client.execute<unknown[]>(
		"games",
		client.games().select("hypes").where("hypes > 50").sort("hypes", "desc"),
	);

	// TODO: There is no error handling for responses in an incorrect state
	const parsedResults = [];
	for (const game of results) {
		const result = GameSearchResultSchema.safeParse(game);
		if (result.success) {
			parsedResults.push(result.data);
		}
	}

	return parsedResults;
}

/// QUERY BUILDER

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

