import type { Route } from "./+types/games";
import { ExploreGameSearch } from "~/components/explore/search";
import { LocalCache } from "~/lib/cache";
import { SearchResultsTable } from "~/components/explore/search-results-table";
import { getSearchResults } from "~/services/igdb.server";
import { withLoaderLogging } from "~/lib/route-logger.server";
import { addSaveGameJob } from "server/queues";

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

// TODO: Abstract the validation into the igdb module

const exploreGamesLoader = async ({ request }: Route.LoaderArgs) => {
	const { search, page } = getSearchParams(request.url);
	const results = await (search ? getSearchResults(search, page) : []);

	if (results.length === 0) {
		return [];
	}

	const jobPromises = results.map((game) => addSaveGameJob(game.id, 5));
	try {
		await Promise.all(jobPromises);
		console.log(`Added ${jobPromises.length} save-game jobs to the queue`);
	} catch (error) {
		console.error("Failed to add jobs to the queue:", error);
	}

	return results;
};

export const loader = withLoaderLogging("explore/games", exploreGamesLoader);

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
	breadcrumb: "Games",
};
