import { Sheet, SheetContent, SheetHeader, SheetTitle } from "~/components/ui/sheet";
import type { Playlist } from "~/db/queries/playlist";
import { CoverImage } from "../base-game-item";
import { Checkbox } from "~/components/ui/checkbox";
import type { GameWithPlaylistIds } from "~/db/queries/collection";
import { useState } from "react";
import { useAddGamesToPlaylist, useRemoveGameFromPlaylist } from "~/db/hooks/playlists";

interface GameSheetProps {
	playlists: Playlist[];
	selectedGame: GameWithPlaylistIds | undefined;
	isOpen: boolean;
	setIsOpen: (isOpen: boolean) => void;
}

export function GameSheet({
	playlists,
	selectedGame,
	isOpen,
	setIsOpen,
}: GameSheetProps) {
	if (!selectedGame) {
		return null;
	}

	return (
		<Sheet open={isOpen} onOpenChange={setIsOpen}>
			<SheetContent>
				<SheetHeader>
					<SheetTitle>{selectedGame.name}</SheetTitle>
				</SheetHeader>
				<div className="p-4">
					{playlists.map((playlist) => (
						<PlaylistCheckbox
							key={playlist.id}
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
