import { withLoaderLogging } from "~/lib/route-logger.server";
import { getHypedGames } from "~/services/igdb.server";
import type { Route } from "./+types/hyped";
import { MainLayout } from "~/components/layout/main";
import { LibraryView } from "~/components/library/library-view";
import { ExploreGame } from "~/components/library/explore-game-item";

const mostHypedLoader = async () => {
	const mostHypedGames = await getHypedGames();

	return { mostHypedGames };
};

export const loader = withLoaderLogging("explore/top-rated/all", mostHypedLoader);

export default function ExploreHypedPage({ loaderData }: Route.ComponentProps) {
	const { mostHypedGames } = loaderData;

	return (
		<MainLayout>
			<LibraryView>
				{mostHypedGames?.map((game) => (
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
	breadcrumb: "Hyped",
};
