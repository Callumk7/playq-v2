import { Button } from "../ui/button";
import { Trash } from "lucide-react";
import { CoverImage } from "./base-game-item";
import { useDeleteGameFromCollection } from "~/db/hooks/collection";
import { useSession } from "~/lib/auth/auth-client";
import { useCollectionStore } from "~/stores/games-collection-store";

interface CollectionGameProps {
	coverId: string | null;
	name: string;
	gameId: number;
}
export function CollectionGame({ coverId, name, gameId }: CollectionGameProps) {
	const session = useSession();
  const setSelectedGameId = useCollectionStore((state) => state.setSelectedGameId);
  const setIsGameSheetOpen = useCollectionStore((state) => state.setIsGameSheetOpen);

  const handleSelectGame = () => {
    setSelectedGameId(gameId);
    setIsGameSheetOpen(true);
  };

	const { handleDelete, isDeleting, isDeleted } = useDeleteGameFromCollection({
		gameId,
		userId: session ? session.user.id : "",
	});

	const handleDeleteClicked = (e: React.MouseEvent<HTMLButtonElement>) => {
		e.preventDefault();
		e.stopPropagation();
		handleDelete();
	};

	return (
		<div
			// biome-ignore lint/a11y/useSemanticElements: No nested buttons
			role="button"
			tabIndex={0}
			onClick={handleSelectGame}
			onKeyDown={(e) => {
				if (e.key === "Enter") {
					handleSelectGame();
				}
			}}
			className="hover:bg-muted p-2 h-full rounded-md group text-left"
		>
			<CoverImage
				imageId={coverId}
				className={isDeleting || isDeleted ? "transition-all blur-md duration-200" : ""}
			/>
			<div className="w-full flex justify-between py-2">
				<p className="text-sm">{name}</p>
				<div className="flex gap-1 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 duration-200 ease-in-out">
					<Button size={"icon"} onClick={handleDeleteClicked}>
						<Trash />
					</Button>
				</div>
			</div>
		</div>
	);
}
