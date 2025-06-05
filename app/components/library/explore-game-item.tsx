import { CoverImage } from "./base-game-item";
import { SaveSearchResultButton } from "../explore/search-results-button";

interface ExploreGameProps {
	coverId: string | null;
	name: string;
	gameId: number;
  rating: number;
}
export function ExploreGame({ coverId, name, gameId, rating }: ExploreGameProps) {

	return (
		<div className="group hover:bg-muted p-2 h-full rounded-md">
			<CoverImage imageId={coverId} />
			<div className="w-full flex justify-between py-2">
				<p className="text-sm">{name}</p>
        <SaveSearchResultButton gameId={gameId} />
			</div>
		</div>
	);
}
