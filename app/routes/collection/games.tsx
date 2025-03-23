import { LibraryView } from "~/components/library/library-view";
import { CollectionGame } from "~/components/library/game-item";
import type { Route } from "./+types/games";
import { getAndValidateSession } from "~/lib/auth/helpers";
import { getUserGames } from "~/db/queries/collection";
import { getPlaylists } from "~/db/queries/playlist";
import { useSearch } from "~/hooks/use-search";
import { InputWithLabel } from "~/components/forms/inputs";

export const loader = async ({ request }: Route.LoaderArgs) => {
	const session = await getAndValidateSession(request);

	const userCollection = await getUserGames(session.user.id);
	const userPlaylists = await getPlaylists(session.user.id);

	return { userCollection, userPlaylists };
};

export default function CollectionIndexPage({ loaderData }: Route.ComponentProps) {
	const { userCollection, userPlaylists } = loaderData;
	const { searchTerm, setSearchTerm, searchedGames } = useSearch(userCollection);

	return (
		<div>
			<InputWithLabel
				label="Search"
				id="search"
				value={searchTerm}
				onInput={(e) => setSearchTerm(e.target.value)}
			/>
			<LibraryView>
				{searchedGames?.map((game) => (
					<CollectionGame
						key={game.id}
						gameId={game.id}
						coverId={game.coverImageId}
						name={game.name}
						playlists={userPlaylists}
					/>
				))}
			</LibraryView>
		</div>
	);
}
