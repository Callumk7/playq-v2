import { getAndValidateSession } from "~/lib/auth/helpers";
import { parseForm } from "zodix";
import { z } from "zod";
import { createPlaylist, getPlaylists } from "~/db/queries/playlist";
import type { Route } from "./+types";
import { CreatePlaylistSheet } from "./components/create-playlist-sheet";
import { MainLayout } from "~/components/layout/main";
import { PlaylistTable } from "~/components/playlists/playlist-table";

export const loader = async ({ request }: Route.LoaderArgs) => {
	const session = await getAndValidateSession(request);
	const userId = session.user.id;
  const userPlaylists = await getPlaylists(userId);
	return userPlaylists;
};

export const action = async ({ request }: Route.ActionArgs) => {
	const session = await getAndValidateSession(request);
	const userId = session.user.id;
	const { name } = await parseForm(request, { name: z.string() });

	const newPlaylist = await createPlaylist({ name, creatorId: userId });
	return newPlaylist;
};

export default function ({ loaderData }: Route.ComponentProps) {
	const userPlaylists = loaderData;
	return (
    <MainLayout>
      <CreatePlaylistSheet />
      <PlaylistTable playlists={userPlaylists} />
    </MainLayout>
	);
}
