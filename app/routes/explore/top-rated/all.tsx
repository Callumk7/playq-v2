import { LibraryView } from "~/components/library/library-view";
import { ExploreGame } from "~/components/library/explore-game-item";
import { MainLayout } from "~/components/layout/main";
import { GenreNavigation } from "~/components/library/genre-selector";
import { getAllGenres, getTopGames } from "~/services/igdb.server";
import type { Route } from "./+types/all";
import { withLoaderLogging } from "~/lib/route-logger.server";

const topRatedAllLoader = async () => {
	const topRatedGames = await getTopGames();
	const allGenres = await getAllGenres();

	return { topRatedGames, allGenres };
};

export const loader = withLoaderLogging("explore/top-rated/all", topRatedAllLoader);

export default function ExploreTopRatedPage({ loaderData }: Route.ComponentProps) {
	const { topRatedGames, allGenres } = loaderData;

	return (
		<MainLayout>
			<GenreNavigation genres={allGenres} />
			<LibraryView>
				{topRatedGames?.map((game) => (
					<ExploreGame
						key={game.id}
						name={game.name}
						gameId={game.id}
						coverId={game.cover?.image_id ?? null}
						rating={game.total_rating ?? 0}
					/>
				))}
			</LibraryView>
		</MainLayout>
	);
}

export const handle = {
	breadcrumb: "Top Rated",
};
