import { getSearchResults, getTopRatedRecentGames } from "~/services/igdb";
import type { Route } from "./+types/games";
import { ExploreGameSearch } from "~/components/explore/search";
import { LibraryView } from "~/components/library/library-view";
import { LocalCache } from "~/lib/cache";
import { calculateWeightedRating } from "~/lib/weighted-rating";
import { validateAndMapGame } from "~/services/database-sync";
import { db } from "~/db";
import { games, type GamesInsert } from "~/db/schema/games";
import { ExploreGame } from "~/components/library/explore-game-item";

function getSearchParams(urlString: string) {
	const url = new URL(urlString);
	const search = url.searchParams.get("search");
	const page = url.searchParams.get("page");

	return {
		search,
		page,
	};
}

let isInitialRequest = true;

export const loader = async ({ request }: Route.LoaderArgs) => {
	const { search, page } = getSearchParams(request.url);
	const results = await (search
		? getSearchResults(search, page)
		: getTopRatedRecentGames());

  if (results.length === 0) {
    return [];
  }

  const parsedResults: GamesInsert[] = [];
  for (const game of results) {
    try {
      const parsedGame = validateAndMapGame(game);
      parsedResults.push(parsedGame);
    } catch (error) {
      console.error(`error parsing ${game.id}`);
      console.error(error);
    }
  }

  if (parsedResults.length > 0) {
    await db.insert(games).values(parsedResults).onConflictDoNothing();
  }

	const weightedGames = results.map((game) => ({
		...game,
		rating: calculateWeightedRating(game.rating!, game.rating_count!),
	}));

	weightedGames.sort((a, b) => b.rating - a.rating);

	return weightedGames;
};

export const clientLoader = async ({ serverLoader, request }: Route.ClientLoaderArgs) => {
	const { search } = getSearchParams(request.url);
	const cacheKey = search ?? "top";

	const cache = new LocalCache();

	if (isInitialRequest) {
		isInitialRequest = false;
		const serverData = await serverLoader();
		cache.set(cacheKey, serverData);
		return serverData;
	}

	const cachedData = cache.get<typeof serverData>(cacheKey);
	if (cachedData) {
		return cachedData;
	}

	const serverData = await serverLoader();
	cache.set(cacheKey, serverData);
	return serverData;
};

clientLoader.hydrate = true;

export default function ExploreGamesPage({ loaderData }: Route.ComponentProps) {
	const games = loaderData;
	return (
		<div className="p-2 space-y-2">
			<ExploreGameSearch />
			<LibraryView>
				{games?.map((game) => (
					<ExploreGame key={game.id} gameId={game.id} coverId={game.cover!.image_id} name={game.name} />
				))}
			</LibraryView>
		</div>
	);
}

export const handle = {
  breadcrumb: "Games"
}
