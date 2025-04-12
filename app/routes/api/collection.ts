import { eq } from "drizzle-orm";
import type { LoaderFunctionArgs } from "react-router";
import { z } from "zod";
import { parseForm } from "zodix";
import { db } from "~/db";
import { createGame, getGameById } from "~/db/queries/games";
import { usersToGames } from "~/db/schema/collection";
import { games } from "~/db/schema/games";
import { genresToGames } from "~/db/schema/genres";
import { validateAndMapGame } from "~/schema/igdb";
import { getFullGame } from "~/services/igdb.server";

const saveToCollectionSchema = z.object({
	userId: z.string(),
	gameId: z.string(),
});

export const action = async ({ request }: LoaderFunctionArgs) => {
	// We want to create a join between users and games.
	const { userId, gameId } = await parseForm(request, saveToCollectionSchema);

	// check game exists
	const game = await getGameById(Number(gameId));

	if (!game) {
		console.log("Fetching game from IGDB");
		const gameData = await getFullGame(Number(gameId));
		console.log(gameData);
		console.log("Now validating game data for the database..");

		const validGame = validateAndMapGame(gameData[0]);
		console.log(validGame);

		if (validGame) {
			await createGame(validGame);
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
		} else {
			return { success: false, error: "Failed to parse game" };
		}
	} else {
		console.log(`Found game: ${game.name}`);
		const gameData = await getFullGame(Number(gameId));
		const validGame = validateAndMapGame(gameData[0]);
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

	return { success: true, data: { userId, gameId } };
};
