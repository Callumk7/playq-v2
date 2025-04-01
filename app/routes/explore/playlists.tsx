import { getPlaylists } from "~/db/queries/playlist";
import type { Route } from "./+types/playlists";

export const loader = async () => {
	const publicPlaylists = await getPlaylists(undefined, false);
	return publicPlaylists;
};

export default function ExplorePlaylistsPage({ loaderData }: Route.ComponentProps) {
	const publicPlaylists = loaderData;
	return (
		<div>
			<h2>Explore Playlist Page</h2>
			{publicPlaylists.map((playlist) => (
				<div key={playlist.id}>{playlist.name}</div>
			))}
		</div>
	);
}
