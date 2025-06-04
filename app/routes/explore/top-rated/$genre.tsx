import { GetTopGamesByGenre } from "~/services/igdb.server";
import type { Route } from "./+types/$genre";
import { MainLayout } from "~/components/layout/main";
import { LibraryView } from "~/components/library/library-view";
import { ExploreGame } from "~/components/library/explore-game-item";
import { withLoaderLogging } from "~/lib/route-logger.server";

const topRatedGenreLoader = async ({ params }: Route.LoaderArgs) => {
	const genreId = params.genreId;
	const topGames = await GetTopGamesByGenre(Number(genreId));

	return topGames;
};

export const loader = withLoaderLogging("explore/top-rated/$genre", topRatedGenreLoader);

export default function TopRatedByGenrePage({ loaderData }: Route.ComponentProps) {
  const topGames = loaderData;
	return (
		<MainLayout>
			<LibraryView>
				{topGames?.map((game) => (
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
