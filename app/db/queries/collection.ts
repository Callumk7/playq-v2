import { and, eq, inArray, sql } from "drizzle-orm";
import { db } from "..";
import { usersToGames } from "../schema/collection"; // Adjust path as needed
import { games } from "../schema/games"; // Adjust path as needed
import type { Game } from "./games";

// Types
export type GameCollection = typeof usersToGames.$inferSelect;
export type GameWithPlaylistIds = Game & { playlistIds: string[] };

// Add a game to user's collection
export async function addGameToCollection(
	userId: string,
	gameId: number,
): Promise<boolean> {
	try {
		// Check if the game exists
		const gameExists = await db.query.games.findFirst({
			where: eq(games.id, gameId),
		});

		if (!gameExists) {
			return false;
		}

		// Check if the relationship already exists
		const existingRelation = await db.query.usersToGames.findFirst({
			where: and(eq(usersToGames.userId, userId), eq(usersToGames.gameId, gameId)),
		});

		if (existingRelation) {
			return true; // Already in collection
		}

		// Add to collection
		await db.insert(usersToGames).values({
			userId,
			gameId,
		});

		return true;
	} catch (error) {
		console.error("Error adding game to collection:", error);
		return false;
	}
}

// Remove a game from user's collection
export async function removeGameFromCollection(
	userId: string,
	gameId: number,
): Promise<boolean> {
	try {
		const result = await db
			.delete(usersToGames)
			.where(and(eq(usersToGames.userId, userId), eq(usersToGames.gameId, gameId)));

		return result.count > 0;
	} catch (error) {
		console.error("Error removing game from collection:", error);
		return false;
	}
}

// Check if a game is in user's collection
export async function isGameInCollection(
	userId: string,
	gameId: number,
): Promise<boolean> {
	const relation = await db.query.usersToGames.findFirst({
		where: and(eq(usersToGames.userId, userId), eq(usersToGames.gameId, gameId)),
	});

	return !!relation;
}

// Get all game IDs in user's collection
export async function getUserGameIds(userId: string): Promise<number[]> {
	const relations = await db
		.select({ gameId: usersToGames.gameId })
		.from(usersToGames)
		.where(eq(usersToGames.userId, userId));

	return relations.map((r) => r.gameId);
}

// Get all games in user's collection with full game details
export async function getUserGames(userId: string): Promise<Game[]> {
	const gameIds = await getUserGameIds(userId);

	if (gameIds.length === 0) {
		return [];
	}

	return await db.select().from(games).where(inArray(games.id, gameIds));
}

// Get all games in a user's collection, with playlistIds
export async function getUserGamesWithPlaylistIds(
	userId: string,
): Promise<GameWithPlaylistIds[]> {
	const gameIds = await getUserGameIds(userId);

	if (gameIds.length === 0) {
		return [];
	}

	const result = await db.query.games.findMany({
		where: inArray(games.id, gameIds),
		with: {
			playlists: true,
		},
	});

	return result.map((game) => ({
		...game,
		playlistIds: game.playlists.map((playlist) => playlist.playlistId),
	}));
}

// Add multiple games to user's collection
export async function addGamesToCollection(
	userId: string,
	gameIds: number[],
): Promise<boolean> {
	if (gameIds.length === 0) {
		return true;
	}

	try {
		// Get existing relations to avoid duplicates
		const existingRelations = await db
			.select()
			.from(usersToGames)
			.where(
				and(
					eq(usersToGames.userId, userId),
					inArray(usersToGames.gameId, gameIds),
				),
			);

		const existingGameIds = new Set(existingRelations.map((r) => r.gameId));
		const newGameIds = gameIds.filter((id) => !existingGameIds.has(id));

		if (newGameIds.length === 0) {
			return true;
		}

		// Add new relations
		await db.insert(usersToGames).values(
			newGameIds.map((gameId) => ({
				userId,
				gameId,
			})),
		);

		return true;
	} catch (error) {
		console.error("Error adding games to collection:", error);
		return false;
	}
}

// Remove multiple games from user's collection
export async function removeGamesFromCollection(
	userId: string,
	gameIds: number[],
): Promise<boolean> {
	if (gameIds.length === 0) {
		return true;
	}

	try {
		await db
			.delete(usersToGames)
			.where(
				and(
					eq(usersToGames.userId, userId),
					inArray(usersToGames.gameId, gameIds),
				),
			);

		return true;
	} catch (error) {
		console.error("Error removing games from collection:", error);
		return false;
	}
}

// Count games in user's collection
export async function countUserGames(userId: string): Promise<number> {
	const result = await db
		.select({ count: sql`count(*)` })
		.from(usersToGames)
		.where(eq(usersToGames.userId, userId));

	return result[0].count as number;
}

// Get users who have a specific game in their collection
export async function getUsersWithGame(gameId: number): Promise<string[]> {
	const relations = await db
		.select({ userId: usersToGames.userId })
		.from(usersToGames)
		.where(eq(usersToGames.gameId, gameId));

	return relations.map((r) => r.userId);
}
