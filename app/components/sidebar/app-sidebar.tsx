import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarHeader,
	SidebarRail,
} from "~/components/ui/sidebar";
import type { Playlist } from "~/db/queries/playlist";
import { NavCollection } from "./nav-main";
import { NavUser } from "./nav-user";
import { NavExplore } from "./nav-projects";

interface SidebarProps extends React.ComponentProps<typeof Sidebar> {
	playlists: Playlist[];
}
export function AppSidebar({ playlists, ...props }: SidebarProps) {
	return (
		<Sidebar collapsible="icon" {...props}>
			<SidebarHeader>
        <h2 className="p-3 text-sm font-semibold text-primary">playQ</h2>
			</SidebarHeader>
			<SidebarContent>
				<NavCollection playlists={playlists} />
				<NavExplore />
			</SidebarContent>
			<SidebarFooter>
				<NavUser />
			</SidebarFooter>
			<SidebarRail />
		</Sidebar>
	);
}
