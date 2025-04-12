import { getPlaylists } from "~/db/queries/playlist";
import type { Route } from "./+types/playlists";
import { MainLayout } from "~/components/layout/main";
import { PlaylistTable } from "~/components/playlists/playlist-table";

export const loader = async () => {
	const publicPlaylists = await getPlaylists(undefined, false);
	return publicPlaylists;
};

export default function ExplorePlaylistsPage({ loaderData }: Route.ComponentProps) {
	const publicPlaylists = loaderData;
	return (
    <MainLayout>
      <PlaylistTable playlists={publicPlaylists} />
    </MainLayout>
	);
}

export const handle = {
  breadcrumb: "Playlists",
}
