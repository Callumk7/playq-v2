import { getAndValidateSession } from "~/lib/auth/helpers";
import type { Route } from "./+types";
import { getPlaylistById } from "~/db/queries/playlist";
import { redirect } from "react-router";

export const loader = async ({ request, params }: Route.LoaderArgs) => {
	const session = await getAndValidateSession(request);
	const { playlistId } = params;
	if (!playlistId) {
		throw redirect("/collection/playlists");
	}

	return await getPlaylistById(playlistId);
};

export default function PlaylistPage({ loaderData }: Route.ComponentProps) {
	const playlist = loaderData;
	return (
		<div>
			<h2>Playlist Page</h2>
		</div>
	);
}
