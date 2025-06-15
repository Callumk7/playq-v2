import { eq } from "drizzle-orm";
import type { ActionFunctionArgs } from "react-router";
import { z } from "zod";
import { parseParams } from "zodix";
import { db } from "~/db/index.server";
import { createGame, getGameById } from "~/db/queries/games";
import { usersToGames } from "~/db/schema/collection";
import { games } from "~/db/schema/games";
import { genresToGames } from "~/db/schema/genres";
import { withActionLogging } from "~/lib/route-logger.server";
import { validateAndMapGame } from "~/schema/igdb";
import { getFullGame, getGameIdsFromSteamIds } from "~/services/igdb.server";

const saveGamesSchema = z.object({
	steamIds: z.array(z.number()),
});

// I sup

const saveToUserCollectionAction = async ({ request, params }: ActionFunctionArgs) => {
	const { userId } = parseParams(params, { userId: z.string() });

	const json = await request.json();
	const result = saveGamesSchema.safeParse(json);

	if (!result.success) {
		return { success: false, error: "Failed to parse request body" };
	}

	const gameIds = await getGameIdsFromSteamIds(result.data.steamIds);

	for (const gameId of gameIds) {
		const existingGame = await getGameById(Number(gameId));
		if (!existingGame) {
			const gameData = await getFullGame(Number(gameId));

			const validGame = validateAndMapGame(gameData);

			if (validGame) {
				await createGame(validGame);

				if (validGame.genres) {
					for (const genre of validGame.genres) {
						await db
							.insert(genresToGames)
							.values({
								gameId: Number(validGame.id),
								genreId: genre,
							})
							.onConflictDoNothing();
						console.log(`Added genre ${genre} to game ${validGame.id}`);
					}
				}
			} else {
				console.log(`Invalid game: ${gameData.name}`);
			}
		} else {
			console.log(`Found game: ${existingGame.name}`);
			const gameData = await getFullGame(gameId);
			const validGame = validateAndMapGame(gameData);
			await db
				.update(games)
				.set({ ...validGame, updatedAt: new Date() })
				.where(eq(games.id, validGame.id));
			if (validGame.genres) {
				console.log("found game genres, linking..");
				for (const genre of validGame.genres) {
					await db
						.insert(genresToGames)
						.values({
							gameId: Number(gameId),
							genreId: genre,
						})
						.onConflictDoNothing();
					console.log(`Added genre ${genre} to game ${gameId}`);
				}
			}
		}
		await db
			.insert(usersToGames)
			.values({ userId, gameId: Number(gameId) })
			.onConflictDoNothing();
	}

	return { success: true, data: gameIds };
};

export const action = withActionLogging(
	"api/collection/$userId",
	saveToUserCollectionAction,
);
