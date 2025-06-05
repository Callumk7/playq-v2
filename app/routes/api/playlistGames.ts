import { parseForm, zx } from "zodix";
import type { Route } from "./+types/playlistGames";
import { removeGamesFromPlaylist } from "~/db/queries/playlist";
import { withActionLogging } from "~/lib/route-logger.server";

const playlistGamesAction = async ({request, params}: Route.ActionArgs) => {
	const { playlistId } = params;
	const { gameId } = await parseForm(request, {
		gameId: zx.NumAsString,
	});

	return await removeGamesFromPlaylist(playlistId, [Number(gameId)]);
}

export const action = withActionLogging("api/playlistGames", playlistGamesAction);
