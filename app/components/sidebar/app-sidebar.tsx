import { AudioWaveform, Command, GalleryVerticalEnd } from "lucide-react";

import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarHeader,
	SidebarRail,
} from "~/components/ui/sidebar";
import type { Playlist } from "~/db/queries/playlist";
import { TeamSwitcher } from "./team-switcher";
import { NavCollection } from "./nav-main";
import { NavUser } from "./nav-user";
import { NavExplore } from "./nav-projects";

// This is sample data.
const data = {
	teams: [
		{
			name: "Acme Inc",
			logo: GalleryVerticalEnd,
			plan: "Enterprise",
		},
		{
			name: "Acme Corp.",
			logo: AudioWaveform,
			plan: "Startup",
		},
		{
			name: "Evil Corp.",
			logo: Command,
			plan: "Free",
		},
	],
};

interface SidebarProps extends React.ComponentProps<typeof Sidebar> {
	playlists: Playlist[];
}
export function AppSidebar({ playlists, ...props }: SidebarProps) {
	return (
		<Sidebar collapsible="icon" {...props}>
			<SidebarHeader>
				<TeamSwitcher teams={data.teams} />
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
