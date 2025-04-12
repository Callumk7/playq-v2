import { LibraryView } from "~/components/library/library-view";
import { ExploreGame } from "~/components/library/explore-game-item";
import { MainLayout } from "~/components/layout/main";
import { GenreNavigation, GenreSelector } from "~/components/library/genre-selector";
import { getAllGenres, getTopGames } from "~/services/igdb.server";
import { useState } from "react";
import type { Route } from "./+types/all";

export const loader = async () => {
	const topRatedGames = await getTopGames();
	const allGenres = await getAllGenres();

	return { topRatedGames, allGenres };
};

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
