////////////////////////////////////////////////////////////////////////////////
//                           IGDB TYPESCRIPT SDK
////////////////////////////////////////////////////////////////////////////////

import { IGDBGameSchema } from "~/schema/igdb";

const IGDB_BASE_URL = "https://api.igdb.com/v4";

export class IGDBClient {
	private baseUrl: string = IGDB_BASE_URL;
	private clientId: string;
	private accessToken: string;

	constructor(clientId: string, accessToken: string) {
		this.clientId = clientId;
		this.accessToken = accessToken;
	}

	games(preset: "full" | "default" = "default"): QueryBuilder {
		return new QueryBuilder().selectPreset(preset);
	}

	async execute(endpoint: string, queryBuilder: QueryBuilder): Promise<unknown[]> {
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
			console.error(response.statusText);
			console.error(await response.text());
			throw new Error(`HTTP error! status: ${response.status}`);
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
		default: ["name", "cover.image_id", "rating"],
	};

	selectPreset(preset: "full" | "default" = "default"): QueryBuilder {
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

const client = new IGDBClient(
	process.env.IGDB_CLIENT_ID!,
	process.env.IGDB_BEARER_TOKEN!,
);
export async function getTopRatedRecentGames() {
	const games = await client.execute(
		"games",
		client
			.games("full")
			.where("release_dates.y >= 2015")
			.where("aggregated_rating_count >= 20")
			.sort("aggregated_rating", "desc")
			.limit(30),
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


