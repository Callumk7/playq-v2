import { Sheet, SheetContent, SheetHeader, SheetTitle } from "~/components/ui/sheet";
import type { Playlist } from "~/db/queries/playlist";
import { Checkbox } from "~/components/ui/checkbox";
import { useState } from "react";
import { useAddGamesToPlaylist, useRemoveGameFromPlaylist } from "~/db/hooks/playlists";
import { useCollectionStore } from "~/stores/games-collection-store";
import { useGameCollectionLoaderData } from "~/routes/collection/games";

interface GameSheetProps {
	playlists: Playlist[];
}

export function GameSheet({ playlists }: GameSheetProps) {
	const isGameSheetOpen = useCollectionStore((state) => state.isGameSheetOpen);
	const setIsGameSheetOpen = useCollectionStore((state) => state.setIsGameSheetOpen);
	const selectedGameId = useCollectionStore((state) => state.selectedGameId);

	const { userCollection } = useGameCollectionLoaderData();
	const selectedGame = userCollection.find((game) => game.id === selectedGameId);

	if (!selectedGame) {
		return null;
	}

	return (
		<Sheet open={isGameSheetOpen} onOpenChange={setIsGameSheetOpen}>
			<SheetContent>
				<SheetHeader>
					<SheetTitle>{selectedGame.name}</SheetTitle>
				</SheetHeader>
				<div className="p-4 space-y-4">
					<h2 className="font-semibold text-xl">Playlists</h2>
					{playlists.map((playlist) => (
						<PlaylistCheckbox
							key={playlist.id}
							gameId={selectedGame.id}
							playlist={playlist}
							selectedGamePlaylistIds={selectedGame.playlistIds}
						/>
					))}
				</div>
			</SheetContent>
		</Sheet>
	);
}

interface PlaylistCheckboxProps {
	playlist: Playlist;
	gameId: number;
	selectedGamePlaylistIds: string[];
}

function PlaylistCheckbox({
	playlist,
	gameId,
	selectedGamePlaylistIds,
}: PlaylistCheckboxProps) {
	const { handleAddGame } = useAddGamesToPlaylist(playlist.id);
	const { handleRemoveGame } = useRemoveGameFromPlaylist(playlist.id);
	const [isChecked, setIsChecked] = useState<boolean | "indeterminate">(
		selectedGamePlaylistIds.includes(playlist.id),
	);
	const handleCheckChange = (checked: boolean | "indeterminate") => {
		setIsChecked(checked);
		if (checked) {
			handleAddGame(gameId);
		} else {
			handleRemoveGame(gameId);
		}
	};
	return (
		<div key={playlist.id} className="flex items-center space-x-2">
			<Checkbox
				id={playlist.id}
				checked={isChecked}
				onCheckedChange={handleCheckChange}
			/>
			<label
				htmlFor={playlist.id}
				className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
			>
				{playlist.name}
			</label>
		</div>
	);
}
