import {
	Menubar,
	MenubarContent,
	MenubarItem,
	MenubarMenu,
	MenubarTrigger,
} from "~/components/ui/menubar";
import { useDeletePlaylist, useUpdatePlaylist } from "~/db/hooks/playlists";

interface PlaylistMenuProps {
	playlistId: string;
}

export function PlaylistMenu({ playlistId }: PlaylistMenuProps) {
	const { handleDelete } = useDeletePlaylist(playlistId);
	const { handleUpdatePlaylist } = useUpdatePlaylist(playlistId);

	return (
		<Menubar className="w-fit">
			<MenubarMenu>
				<MenubarTrigger>Menu</MenubarTrigger>
				<MenubarContent>
					<MenubarItem onClick={() => handleUpdatePlaylist({ privacySetting: "PUBLIC" })}>
						Make Public
					</MenubarItem>
					<MenubarItem onClick={handleDelete}>Delete</MenubarItem>
				</MenubarContent>
			</MenubarMenu>
		</Menubar>
	);
}
