import { Button } from "../ui/button";
import { ChevronDownIcon, MenuIcon, Trash } from "lucide-react";
import { useFetcher } from "react-router";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { CoverImage } from "./base-game-item";
import { useDeleteGameFromCollection } from "~/db/hooks/collection";
import { useSession } from "~/lib/auth/auth-client";
import { ToggleGroup, ToggleGroupItem } from "../ui/toggle-group";
import { useCollectionStore } from "~/stores/games-collection-store";

interface CollectionGameProps {
	coverId: string | null;
	name: string;
	gameId: number;
	playlists: PlaylistMenuItem[];
}
export function CollectionGame({
	coverId,
	name,
	gameId,
	playlists,
}: CollectionGameProps) {
	const session = useSession();
	const store = useCollectionStore();
	const { handleDelete, isDeleting, isDeleted } = useDeleteGameFromCollection({
		gameId,
		userId: session.user.id,
	});

	const handleDeleteClicked = (e: React.MouseEvent<HTMLButtonElement>) => {
		e.preventDefault();
		e.stopPropagation();
		handleDelete();
	};

	return (
		<button type="button" onClick={() => store.selectGame(gameId)} className="hover:bg-muted p-2 h-full rounded-md group text-left">
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
		</button>
	);
}

// Controls
type PlaylistMenuItem = {
	id: number;
	name: string;
};

interface SaveToPlaylistProps {
	gameId: number;
	playlists: PlaylistMenuItem[];
}
export function SaveToPlaylist({ gameId, playlists }: SaveToPlaylistProps) {
	const fetcher = useFetcher();

	const handleSave = async (playlistId: number) => {
		fetcher.submit({ playlistId, gameId }, { method: "POST", action: "/api/playlists" });
	};

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button size="icon" disabled={playlists.length === 0}>
					<ChevronDownIcon />
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent>
				{playlists.map((playlist) => (
					<DropdownMenuItem key={playlist.id} onClick={() => handleSave(playlist.id)}>
						{playlist.name}
					</DropdownMenuItem>
				))}
			</DropdownMenuContent>
		</DropdownMenu>
	);
}

interface CollectionItemControlsProps {
	gameId: number;
}

function CollectionItemControls({ gameId }: CollectionItemControlsProps) {
	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button size="icon">
					<MenuIcon />
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent>
				<ToggleGroup type="single">
					<ToggleGroupItem value="interested">Interested</ToggleGroupItem>
					<ToggleGroupItem value="played">Played</ToggleGroupItem>
					<ToggleGroupItem value="completed">Completed</ToggleGroupItem>
				</ToggleGroup>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
