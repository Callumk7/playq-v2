import { LibraryView } from "~/components/library/library-view";
import type { Route } from "./+types/games";
import { getAndValidateSession } from "~/lib/auth/helpers";
import {
    getUserGamesWithPlaylistIds,
    removeGameFromCollection,
} from "~/db/queries/collection";
import { getPlaylists } from "~/db/queries/playlist";
import { GameTable } from "~/components/library/table-view";
import { CollectionMenubar } from "./components/collection-menubar";
import { CollectionGame } from "~/components/library/collection-game-item";
import { parseForm, zx } from "zodix";
import { z } from "zod";
import { GameSheet } from "~/components/library/components/game-sheet";
import { Input } from "~/components/ui/input";
import { useRouteLoaderData } from "react-router";

export const loader = async ({ request }: Route.LoaderArgs) => {
	const session = await getAndValidateSession(request);

	const userCollection = await getUserGamesWithPlaylistIds(session.user.id);
	const userPlaylists = await getPlaylists(session.user.id);

	return { userCollection, userPlaylists };
};

export const action = async ({ request }: Route.ActionArgs) => {
	if (request.method === "DELETE") {
		const { userId, gameId } = await parseForm(request, {
			userId: z.string(),
			gameId: zx.NumAsString,
		});

		return await removeGameFromCollection(userId, gameId);
	}
};

export default function CollectionIndexPage({ loaderData }: Route.ComponentProps) {
	const { userCollection, userPlaylists } = loaderData;

	return (
		<div>
			<div className="flex gap-2">
				<Input type="search" placeholder="Search" className="w-fit" />
				<CollectionMenubar games={userCollection} />
			</div>
			<LibraryView>
				{userCollection?.map((game) => (
					<CollectionGame
						key={game.id}
						gameId={game.id}
						coverId={game.coverImageId}
						name={game.name}
					/>
				))}
			</LibraryView>
			<GameTable games={userCollection} />
			<GameSheet
				playlists={userPlaylists}
			/>
		</div>
	);
}

export const handle = {
	breadcrumb: "Games",
};

export const useGameCollectionLoaderData = () => {
	const data = useRouteLoaderData<typeof loader>("collection");
	if (!data) {
		throw new Error(
			"You must use the useGameCollectionLoaderData hook inside a route that uses the collection loader",
		);
	}

	return data;
};
