import { getGamesByTotalRating } from "~/db/queries/games";
import type { Route } from "./+types/home";
import { MainLayout } from "~/components/layout/main";
import { Input } from "~/components/ui/input";
import { CollectionMenubar } from "./collection/components/collection-menubar";
import { LibraryView } from "~/components/library/library-view";
import { CollectionGame } from "~/components/library/collection-game-item";
import { useSearch } from "~/hooks/use-search";

export async function loader() {
	const topGames = await getGamesByTotalRating();
	return { topGames };
}

export default function Home({ loaderData }: Route.ComponentProps) {
	const { topGames } = loaderData;
	const { searchTerm, setSearchTerm, searchedGames } = useSearch(topGames);
	return (
		<MainLayout>
			<div className="flex gap-2">
				<Input
					type="search"
					placeholder="Search"
					className="w-fit"
					value={searchTerm}
					onInput={(e) => setSearchTerm(e.currentTarget.value)}
				/>
				<CollectionMenubar games={searchedGames} />
			</div>
			<LibraryView>
				{searchedGames?.map((game) => (
					<CollectionGame
						key={game.id}
						gameId={game.id}
						coverId={game.coverImageId}
						name={game.name}
					/>
				))}
			</LibraryView>
		</MainLayout>
	);
}
