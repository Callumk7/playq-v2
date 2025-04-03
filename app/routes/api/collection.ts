import type { LoaderFunctionArgs } from "react-router";
import { z } from "zod";
import { parseForm } from "zodix";
import { db } from "~/db";
import { createGame, getGameById } from "~/db/queries/games";
import { usersToGames } from "~/db/schema/collection";
import { validateAndMapGame } from "~/services/database-sync";
import { getFullGame } from "~/services/igdb";

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
		console.log("Now validating game data for the database..")

		const validGame = validateAndMapGame(gameData);
		console.log(validGame);


		if (validGame) {
			await createGame(validGame);
		} else {
			return { success: false, error: "Failed to parse game" };
		}
	} else {
		console.log(`Found game: ${game.name}`)
	}

	await db
		.insert(usersToGames)
		.values({ userId, gameId: Number(gameId) })
		.onConflictDoNothing();

	return { success: true, data: { userId, gameId } };
};
