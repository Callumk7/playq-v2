import { getSearchResults } from "~/services/igdb";
import type { Route } from "./+types/games";
import { ExploreGameSearch } from "~/components/explore/search";
import { LocalCache } from "~/lib/cache";
import { validateAndMapGame } from "~/services/database-sync";
import { db } from "~/db";
import { games, type GamesInsert } from "~/db/schema/games";
import { SearchResultsTable } from "~/components/explore/search-results-table";

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
		: []);

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

	return results;
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
      <SearchResultsTable games={games} />
		</div>
	);
}

export const handle = {
  breadcrumb: "Games"
}
