import { getAndValidateSession } from "~/lib/auth/helpers";
import {
	addGamesToPlaylist,
	deletePlaylist,
	getGamesInPlaylist,
	getPlaylistById,
	updatePlaylist,
} from "~/db/queries/playlist";
import { redirect } from "react-router";
import { LibraryView } from "~/components/library/library-view";
import type { Route } from "./+types/playlist";
import { MainLayout } from "~/components/layout/main";
import { PlaylistMenu } from "./components/playlist-menu";
import { CollectionGame } from "~/components/library/collection-game-item";
import { parseForm, zx } from "zodix";
import { playlistsInsertSchema } from "~/db/schema/playlists";

export const loader = async ({ request, params }: Route.LoaderArgs) => {
	const session = await getAndValidateSession(request);
	const { playlistId } = params;
	if (!playlistId) {
		throw redirect("/collection/playlists");
	}

	const playlist = await getPlaylistById(playlistId);

	if (!playlist) {
		throw redirect("/collection/playlists");
	}

	if (playlist.creatorId !== session.user.id) {
		throw redirect("/collection/playlists");
	}

	const playlistGames = await getGamesInPlaylist(playlistId);

	return { playlist, playlistGames };
};

// TODO: Authorisation on this delete action
export const action = async ({ request, params }: Route.ActionArgs) => {
	const { playlistId } = params;

	if (request.method === "POST") {
		const { gameId } = await parseForm(request, {
			gameId: zx.NumAsString,
		});
		return await addGamesToPlaylist(playlistId, [gameId]);
	}

	if (request.method === "PUT") {
		const data = await parseForm(
			request,
			playlistsInsertSchema
				.omit({
					id: true,
					creatorId: true,
					createdAt: true,
					updatedAt: true,
				})
				.partial(),
		);

		return await updatePlaylist(playlistId, data);
	}

	if (request.method === "DELETE") {
		return await deletePlaylist(playlistId);
	}

	return null;
};

export default function PlaylistPage({ loaderData }: Route.ComponentProps) {
	const { playlist, playlistGames } = loaderData;
	return (
		<MainLayout>
			<PlaylistMenu playlistId={playlist.id} />
			<LibraryView>
				{playlistGames?.map((game) => (
					<CollectionGame
						key={game.id}
						gameId={game.id}
						coverId={game.coverImageId}
						name={game.name}
					/>
				))}
			</LibraryView>
		</MainLayout>
	);
}

export const handle = {
	breadcrumb: "Playlist",
};
