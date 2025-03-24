import { getAndValidateSession } from "~/lib/auth/helpers";
import { getGamesInPlaylist, getPlaylistById } from "~/db/queries/playlist";
import { redirect } from "react-router";
import { LibraryView } from "~/components/library/library-view";
import type { Route } from "./+types/playlist";
import { CollectionGame } from "~/components/library/game-item";
import { MainLayout } from "~/components/layout/main";

export const loader = async ({ request, params }: Route.LoaderArgs) => {
	const session = await getAndValidateSession(request);
	const { playlistId } = params;
	if (!playlistId) {
		throw redirect("/collection/playlists");
	}

	const playlist = await getPlaylistById(playlistId);
	const playlistGames = await getGamesInPlaylist(playlistId);

	return { playlist, playlistGames };
};

export default function PlaylistPage({ loaderData }: Route.ComponentProps) {
	const { playlist, playlistGames } = loaderData;
	return (
		<MainLayout>
			<h2 className="text-2xl font-bold">{playlist.name}</h2>
			<LibraryView>
				{playlistGames?.map((game) => (
					<CollectionGame
						key={game.id}
						gameId={game.id}
						coverId={game.coverImageId}
						name={game.name}
						playlists={[]}
					/>
				))}
			</LibraryView>
		</MainLayout>
	);
}
