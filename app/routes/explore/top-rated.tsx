import { getTopRatedRecentGames } from "~/services/igdb";
import type { Route } from "./+types/top-rated";
import { LibraryView } from "~/components/library/library-view";

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
					<div key={game.id}>{game.name}</div>
				))}
			</LibraryView>
		</div>
	);
}

export const handle = {
  breadcrumb: "Top Rated"
}
