import { desc, eq, inArray, isNotNull, sql } from "drizzle-orm";
import { games, basicGames, type GamesInsert } from "../schema/games";
import { usersToGames } from "../schema/collection";
import { db } from "../index.server";

// Types
export type Game = typeof games.$inferSelect;
export type BasicGame = typeof basicGames.$inferSelect;
export type NewGame = Omit<GamesInsert, "updatedAt" | "createdAt">;
export type UpdateGame = Partial<Omit<GamesInsert, "id">>;

// Create a new game
export async function createGame(data: NewGame): Promise<Game> {
	const now = new Date();

	const [game] = await db
		.insert(games)
		.values({
			...data,
			createdAt: now,
			updatedAt: now,
		})
		.returning()
		.onConflictDoNothing();

	return game;
}

// Get a game by ID
export async function getGameById(id: number): Promise<Game | null> {
	const game = await db.query.games.findFirst({
		where: eq(games.id, id),
	});

	return game || null;
}

// Get multiple games by IDs
export async function getGamesByIds(ids: number[]): Promise<Game[]> {
	if (ids.length === 0) {
		return [];
	}

	return await db.select().from(games).where(inArray(games.id, ids));
}

// Get all games with optional pagination
export async function getGames(limit?: number, offset?: number): Promise<Game[]> {
	let query = db.select().from(games).$dynamic();

	// Add ordering to ensure consistent results
	query = query.orderBy(games.id);

	if (limit !== undefined) {
		query = query.limit(limit);
	}

	if (offset !== undefined) {
		query = query.offset(offset);
	}

	return await query;
}

// Get basic games (for lightweight operations)
export async function getBasicGames(
	limit?: number,
	offset?: number,
): Promise<BasicGame[]> {
	let query = db.select().from(basicGames).$dynamic();

	// Add ordering to ensure consistent results
	query = query.orderBy(basicGames.id);

	if (limit !== undefined) {
		query = query.limit(limit);
	}

	if (offset !== undefined) {
		query = query.offset(offset);
	}

	return await query;
}

// Search games by name
export async function searchGamesByName(searchTerm: string, limit = 20): Promise<Game[]> {
	return await db
		.select()
		.from(games)
		.where(sql`${games.name} ILIKE ${`%${searchTerm}%`}`)
		.limit(limit);
}

// Update a game
export async function updateGame(id: number, data: UpdateGame): Promise<Game | null> {
	// First check if the game exists
	const existingGame = await db.query.games.findFirst({
		where: eq(games.id, id),
	});

	if (!existingGame) {
		return null;
	}

	const [updatedGame] = await db
		.update(games)
		.set({
			...data,
			updatedAt: new Date(),
		})
		.where(eq(games.id, id))
		.returning();

	return updatedGame;
}

// Delete a game
export async function deleteGame(id: number): Promise<boolean> {
	// First delete all user associations
	await db.delete(usersToGames).where(eq(usersToGames.gameId, id));

	// Then delete the game
	const result = await db.delete(games).where(eq(games.id, id));

	return result.count > 0;
}

// Count total games
export async function countGames(): Promise<number> {
	const result = await db.select({ count: sql<number>`count(*)` }).from(games);

	return result[0].count;
}

// Get games by platform
export async function getGamesByPlatform(
	platformId: number,
	limit?: number,
	offset?: number,
): Promise<Game[]> {
	let query = db
		.select()
		.from(games)
		.where(sql`${platformId} = ANY(${games.platforms})`)
		.$dynamic();

	if (limit !== undefined) {
		query = query.limit(limit);
	}

	if (offset !== undefined) {
		query = query.offset(offset);
	}

	return await query;
}

// Get games by genre
export async function getGamesByGenre(
	genreId: number,
	limit?: number,
	offset?: number,
): Promise<Game[]> {
	let query = db
		.select()
		.from(games)
		.where(sql`${genreId} = ANY(${games.genres})`)
		.$dynamic();

	if (limit !== undefined) {
		query = query.limit(limit);
	}

	if (offset !== undefined) {
		query = query.offset(offset);
	}

	return await query;
}

// Include genres in queries
export async function getGameWithGenres(gameId: number) {
	return await db.query.games.findFirst({
		where: eq(games.id, gameId),
		with: {
			genresInternal: {
				with: { genre: true },
			},
		},
	});
}

export async function getGamesWithGenres(gameIds: number[]) {
	return await db.query.games.findMany({
		where: inArray(games.id, gameIds),
		with: {
			genresInternal: {
				with: { genre: true },
			},
		},
	});
}

export async function getGamesByTotalRating() {
	return await db.query.games.findMany({
		where: isNotNull(games.totalRating),
		orderBy: [desc(games.totalRating)],
		limit: 25,
	});
}
