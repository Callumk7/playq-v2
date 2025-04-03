import { useState } from "react";
import {
	Menubar,
	MenubarContent,
	MenubarItem,
	MenubarMenu,
	MenubarTrigger,
} from "~/components/ui/menubar";
import { ToggleGroup, ToggleGroupItem } from "~/components/ui/toggle-group";
import { useDeletePlaylist, useUpdatePlaylist } from "~/db/hooks/playlists";

interface PlaylistMenuProps {
	playlistId: string;
	privacySetting: "PUBLIC" | "FRIENDS_ONLY" | "LINK_SHARING" | "PRIVATE";
}

export function PlaylistMenu({ playlistId, privacySetting }: PlaylistMenuProps) {
	const { handleDelete } = useDeletePlaylist(playlistId);
	const { handleUpdatePlaylist } = useUpdatePlaylist(playlistId);

	// TODO: Props do not update on parallel navigation from another playlist.
	// To fix: use useLoaderData
	const [value, setValue] = useState<string>(privacySetting);

	const handleUpdatePrivacySetting = (
		privacySetting: "PUBLIC" | "FRIENDS_ONLY" | "LINK_SHARING" | "PRIVATE",
	) => {
		handleUpdatePlaylist({ privacySetting });
		setValue(privacySetting);
	};

	return (
		<div className="flex gap-2">
			<Menubar className="w-fit">
				<MenubarMenu>
					<MenubarTrigger>Menu</MenubarTrigger>
					<MenubarContent>
						<MenubarItem onClick={handleDelete}>Delete</MenubarItem>
					</MenubarContent>
				</MenubarMenu>
			</Menubar>
			<ToggleGroup
				type="single"
				variant={"outline"}
				value={value}
				onValueChange={handleUpdatePrivacySetting}
			>
				<ToggleGroupItem value="PUBLIC">Public</ToggleGroupItem>
				<ToggleGroupItem value="FRIENDS_ONLY">Friends</ToggleGroupItem>
				<ToggleGroupItem value="LINK_SHARING">Invites</ToggleGroupItem>
				<ToggleGroupItem value="PRIVATE">Private</ToggleGroupItem>
			</ToggleGroup>
		</div>
	);
}
