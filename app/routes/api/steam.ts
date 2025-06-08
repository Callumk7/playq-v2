import type { ActionFunctionArgs } from "react-router";
import { withActionLogging } from "~/lib/route-logger.server";
import { getGamesFromSteamIds } from "~/services/igdb.server";

const saveGameToCollectionWithSteamIdAction = async ({ request }: ActionFunctionArgs) => {
	const body = await request.json();
	const ids = body.steamIds as number[];
	console.log(ids);

	// Get game data
	const data = await getGamesFromSteamIds(ids);

	return data;
};

export const action = withActionLogging(
	"api/steam",
	saveGameToCollectionWithSteamIdAction,
);
