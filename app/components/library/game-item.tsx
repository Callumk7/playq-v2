import { cn } from "~/lib/utils";
import { Button } from "../ui/button";
import { CogIcon, MusicIcon, SaveIcon, Trash } from "lucide-react";
import { Link, useFetcher } from "react-router";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "../ui/dropdown-menu";


interface CoverImageProps {
	imageId: string;
	className?: string;
}
// This component simply renders the image cover art that we retrieve from IGDB
export function CoverImage({ imageId, className }: CoverImageProps) {
	const size = "720p";
	return (
    <div className="rounded-md overflow-hidden h-fit w-full">
      <img
        src={`https://images.igdb.com/igdb/image/upload/t_${size}/${imageId}.jpg`}
        alt="game cover art"
        className={cn(className, "h-fit w-full")}
      />
    </div>
	);
}

interface ExploreGameProps {
	coverId: string;
	name: string;
	gameId: number;
}
export function ExploreGame({ coverId, name, gameId }: ExploreGameProps) {
	const fetcher = useFetcher();

	const handleSave = async () => {
		const userId = localStorage.getItem("userId");
		fetcher.submit({ userId, gameId }, { method: "POST", action: "/api/collection" });
	};

	return (
		<div className="hover:bg-slate-100 p-2 h-full rounded-md">
			<CoverImage imageId={coverId} />
			<div className="w-full flex justify-between py-2">
				<p className="text-sm">{name}</p>
				<Button size={"icon"} onClick={handleSave}>
					<SaveIcon />
				</Button>
			</div>
		</div>
	);
}

function PlaceholderImage() {
	return (
		<div className="bg-slate-200 w-full aspect-[3/4] flex items-center justify-center rounded-md">
			<span className="text-slate-400">No Image</span>
		</div>
	);
}

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
	return (
		<Link to={`/games/${gameId}`} className="hover:bg-slate-100 p-2 h-full rounded-md">
			{coverId ? <CoverImage imageId={coverId} /> : <PlaceholderImage />}
			<div className="w-full flex justify-between py-2">
				<p className="text-sm">{name}</p>
				<div className="flex gap-1">
					<SaveToPlaylist gameId={gameId} playlists={playlists} />
					<Button size={"icon"}>
						<Trash />
					</Button>
					<Button size={"icon"}>
						<CogIcon />
					</Button>
				</div>
			</div>
		</Link>
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
				<Button size="icon">
					<MusicIcon />
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
