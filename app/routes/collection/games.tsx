import { LibraryView } from "~/components/library/library-view";
import type { Route } from "./+types/games";
import { getAndValidateSession } from "~/lib/auth/helpers";
import {
	getUserGamesWithPlaylistIds,
	removeGameFromCollection,
} from "~/db/queries/collection";
import { getPlaylists } from "~/db/queries/playlist";
import { CollectionMenubar } from "./components/collection-menubar";
import { CollectionGame } from "~/components/library/collection-game-item";
import { parseForm, zx } from "zodix";
import { z } from "zod";
import { GameSheet } from "~/components/library/components/game-sheet";
import { Input } from "~/components/ui/input";
import { useRouteLoaderData } from "react-router";
import { MainLayout } from "~/components/layout/main";
import { useSearch } from "~/hooks/use-search";
import { withLoaderLogging, withActionLogging } from "~/lib/route-logger.server";

const collectionGamesLoader = async ({ request }: Route.LoaderArgs) => {
	const session = await getAndValidateSession(request);

	const userCollection = await getUserGamesWithPlaylistIds(session.user.id);
	const userPlaylists = await getPlaylists(session.user.id);

	return { userCollection, userPlaylists };
};

const collectionGamesAction = async ({ request }: Route.ActionArgs) => {
	if (request.method === "DELETE") {
		const { userId, gameId } = await parseForm(request, {
			userId: z.string(),
			gameId: zx.NumAsString,
		});

		return await removeGameFromCollection(userId, gameId);
	}
};

export const loader = withLoaderLogging("collection/games", collectionGamesLoader);
export const action = withActionLogging("collection/games", collectionGamesAction);

export default function CollectionIndexPage({ loaderData }: Route.ComponentProps) {
	const { userCollection, userPlaylists } = loaderData;

	const { searchTerm, setSearchTerm, searchedGames } = useSearch(userCollection);

	return (
		<MainLayout>
			<div className="flex gap-2">
				<Input
					type="search"
					placeholder="Search"
					className="w-fit"
					value={searchTerm}
					onInput={(e) => setSearchTerm(e.currentTarget.value)}
				/>
				<CollectionMenubar games={searchedGames} />
			</div>
			<LibraryView>
				{searchedGames?.map((game) => (
					<CollectionGame
						key={game.id}
						gameId={game.id}
						coverId={game.coverImageId}
						name={game.name}
					/>
				))}
			</LibraryView>
			<GameSheet playlists={userPlaylists} />
		</MainLayout>
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
