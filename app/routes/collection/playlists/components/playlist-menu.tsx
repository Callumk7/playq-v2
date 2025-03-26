import {
	Menubar,
	MenubarContent,
	MenubarItem,
	MenubarMenu,
	MenubarTrigger,
} from "~/components/ui/menubar";
import { useDeletePlaylist } from "~/db/hooks/playlists";

interface PlaylistMenuProps {
	playlistId: string;
}

export function PlaylistMenu({ playlistId }: PlaylistMenuProps) {
	const { handleDelete } = useDeletePlaylist(playlistId);
	return (
    <Menubar className="w-fit">
      <MenubarMenu>
        <MenubarTrigger>Sharing</MenubarTrigger>
        <MenubarContent>
          <MenubarItem>Edit</MenubarItem>
          <MenubarItem onClick={handleDelete}>Delete</MenubarItem>
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
	);
}
