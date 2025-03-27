import { parseForm, zx } from "zodix";
import type { Route } from "./+types/playlistGames";
import { removeGamesFromPlaylist } from "~/db/queries/playlist";

export const action = async ({request, params}: Route.ActionArgs) => {
	const { playlistId } = params;
	const { gameId } = await parseForm(request, {
		gameId: zx.NumAsString,
	});

	return await removeGamesFromPlaylist(playlistId, [Number(gameId)]);
}
