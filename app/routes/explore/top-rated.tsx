import { getTopRatedRecentGames } from "~/services/igdb";
import type { Route } from "./+types/top-rated";
import { LibraryView } from "~/components/library/library-view";
import { ExploreGame } from "~/components/library/explore-game-item";

export const loader = async ({ request, params }: Route.LoaderArgs) => {
	const topRatedGames = await getTopRatedRecentGames();

	return topRatedGames;
};

export default function ExploreTopRatedPage({ loaderData }: Route.ComponentProps) {
	const topGames = loaderData;
	return (
		<div>
			<LibraryView>
				{topGames?.map((game) => (
					<ExploreGame
						key={game.id}
						name={game.name}
						gameId={game.id}
						coverId={game.cover?.image_id ?? null}
					/>
				))}
			</LibraryView>
		</div>
	);
}

export const handle = {
	breadcrumb: "Top Rated",
};
