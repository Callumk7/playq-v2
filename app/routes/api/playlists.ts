import type { ActionFunctionArgs } from "react-router";
import { z } from "zod";
import { parseForm } from "zodix";
import { addGamesToPlaylist } from "~/db/queries/playlist";
import { withActionLogging } from "~/lib/route-logger.server";

const playlistsAction = async ({ request }: ActionFunctionArgs) => {
	const { playlistId, gameId } = await parseForm(request, {
		playlistId: z.string(),
		gameId: z.string(),
	});

	return await addGamesToPlaylist(playlistId, [Number(gameId)]);
};

export const action = withActionLogging("api/playlists", playlistsAction);
