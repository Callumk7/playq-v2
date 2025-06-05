"use client";

import {
	Folder,
	Forward,
	FrameIcon,
	MoreHorizontal,
	PieChartIcon,
	Trash2,
} from "lucide-react";
import { useMemo } from "react";
import { Link, useNavigate } from "react-router";
import {
	SidebarGroup,
	SidebarGroupLabel,
	SidebarMenu,
	SidebarMenuAction,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarMenuSub,
	SidebarMenuSubButton,
	SidebarMenuSubItem,
	useSidebar,
} from "~/components/ui/sidebar";
import type { Playlist } from "~/db/queries/playlist";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";

export function NavCollection({ playlists }: { playlists: Playlist[] }) {
	const { isMobile } = useSidebar();
	const navigate = useNavigate();
	const collectionItems = useMemo(
		() => [
			{
				name: "My Games",
				url: "/collection/games",
				icon: FrameIcon,
				items: [],
			},
			{
				name: "My Playlists",
				url: "/collection/playlists",
				icon: PieChartIcon,
				items: playlists.map((playlist) => ({
					title: playlist.name,
					url: `/collection/playlists/${playlist.id}`,
				})),
			},
		],
		[playlists],
	);

	return (
		<SidebarGroup>
			<SidebarGroupLabel>Collection</SidebarGroupLabel>
			<SidebarMenu>
				{collectionItems.map((item) => (
					<SidebarMenuItem key={item.name}>
						<SidebarMenuButton asChild>
							<Link to={item.url}>
								<item.icon />
								<span>{item.name}</span>
							</Link>
						</SidebarMenuButton>
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<SidebarMenuAction showOnHover>
									<MoreHorizontal />
									<span className="sr-only">More</span>
								</SidebarMenuAction>
							</DropdownMenuTrigger>
							<DropdownMenuContent
								className="w-48 rounded-lg"
								side={isMobile ? "bottom" : "right"}
								align={isMobile ? "end" : "start"}
							>
								<DropdownMenuItem onClick={() => navigate("/collection/playlists/new")}>
									<Folder className="text-muted-foreground" />
									<span>Create New Playlist</span>
								</DropdownMenuItem>
								<DropdownMenuItem>
									<Forward className="text-muted-foreground" />
									<span>Share Playlist</span>
								</DropdownMenuItem>
								<DropdownMenuSeparator />
								<DropdownMenuItem>
									<Trash2 className="text-muted-foreground" />
									<span>Delete Playlist</span>
								</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>
						<SidebarMenuSub>
							{item.items?.map((subItem) => (
								<SidebarMenuSubItem key={subItem.title}>
									<SidebarMenuSubButton asChild>
										<Link to={subItem.url}>
											<span>{subItem.title}</span>
										</Link>
									</SidebarMenuSubButton>
								</SidebarMenuSubItem>
							))}
						</SidebarMenuSub>
					</SidebarMenuItem>
				))}
			</SidebarMenu>
		</SidebarGroup>
	);
}
