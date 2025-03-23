import { ChevronRight } from "lucide-react";

import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from "~/components/ui/collapsible";
import {
	Sidebar,
	SidebarContent,
	SidebarGroup,
	SidebarGroupContent,
	SidebarGroupLabel,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarRail,
} from "~/components/ui/sidebar";
import { Link, useLocation } from "react-router";

const data = {
	navMain: [
		{
			title: "Explore",
			url: "/explore",
			items: [
				{
					title: "Games",
					url: "/explore/games",
				},
				{
					title: "Playlists",
					url: "/explore/playlists",
				},
				{
					title: "People",
					url: "/explore/people",
				},
			],
		},
		{
			title: "Collection",
			url: "/collection",
			items: [
				{
					title: "Games",
					url: "/collection/games",
				},
				{
					title: "Playlists",
					url: "/collection/playlists",
				},
			],
		},
    {
      title: "Friends",
      url: "/friends",
      items: []
    }
	],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const {pathname} = useLocation();

	return (
		<Sidebar {...props}>
			<SidebarHeader>
				<h2 className="text-sm p-2 font-bold">playQ</h2>
			</SidebarHeader>
			<SidebarContent className="gap-0">
				{/* We create a collapsible SidebarGroup for each parent. */}
				{data.navMain.map((item) => (
					<Collapsible
						key={item.title}
						title={item.title}
						defaultOpen
						className="group/collapsible"
					>
						<SidebarGroup>
							<SidebarGroupLabel
								asChild
								className="group/label text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground text-sm"
							>
								<CollapsibleTrigger>
									{item.title}{" "}
									<ChevronRight className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-90" />
								</CollapsibleTrigger>
							</SidebarGroupLabel>
							<CollapsibleContent>
								<SidebarGroupContent>
									<SidebarMenu>
										{item.items.map((item) => (
											<SidebarMenuItem key={item.title}>
												<SidebarMenuButton asChild isActive={pathname === item.url}>
													<Link to={item.url}>{item.title}</Link>
												</SidebarMenuButton>
											</SidebarMenuItem>
										))}
									</SidebarMenu>
								</SidebarGroupContent>
							</CollapsibleContent>
						</SidebarGroup>
					</Collapsible>
				))}
			</SidebarContent>
			<SidebarRail />
		</Sidebar>
	);
}
