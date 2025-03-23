import type { LoaderFunctionArgs } from "react-router";
import { z } from "zod";
import { parseForm } from "zodix";
import { db } from "~/db";
import { usersToGames } from "~/db/schema/collection";

const saveToCollectionSchema = z.object({
	userId: z.string(),
	gameId: z.string(),
});

export const action = async ({ request }: LoaderFunctionArgs) => {
	// We want to create a join between users and games.
	const { userId, gameId } = await parseForm(request, saveToCollectionSchema);

	await db
		.insert(usersToGames)
		.values({ userId, gameId: Number(gameId) })
		.onConflictDoNothing();

	return { success: true, data: { userId, gameId } };
};
