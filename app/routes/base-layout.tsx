import { Outlet, type LoaderFunctionArgs } from "react-router";
import { AppSidebar } from "~/components/app-sidebar";
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from "~/components/ui/breadcrumb";
import { Separator } from "~/components/ui/separator";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "~/components/ui/sidebar";
import { getPlaylists } from "~/db/queries/playlist";
import { useSession } from "~/lib/auth/auth-client";
import { getAndValidateSession } from "~/lib/auth/helpers";
import type { Route } from "./+types/base-layout";

export const loader = async ({request}: LoaderFunctionArgs) => {
  const session = await getAndValidateSession(request);
  const userPlaylists = await getPlaylists(session.user.id);
  return userPlaylists;
}

// TODO: Implement breadcrumbs
// TODO: proper log out

export default function BaseLayout({loaderData}: Route.ComponentProps) {
  const userPlaylists = loaderData;
  const session = useSession();
	return (
		<SidebarProvider>
			<AppSidebar playlists={userPlaylists} />
			<SidebarInset>
				<header className="flex sticky top-0 bg-background h-16 shrink-0 items-center gap-2 border-b px-4">
					<SidebarTrigger className="-ml-1" />
          <span className="text-sm">{session?.user.id}</span>
					<Separator orientation="vertical" className="mr-2 h-4" />
					<Breadcrumb>
						<BreadcrumbList>
							<BreadcrumbItem className="hidden md:block">
								<BreadcrumbLink href="#">Building Your Application</BreadcrumbLink>
							</BreadcrumbItem>
							<BreadcrumbSeparator className="hidden md:block" />
							<BreadcrumbItem>
								<BreadcrumbPage>Data Fetching</BreadcrumbPage>
							</BreadcrumbItem>
						</BreadcrumbList>
					</Breadcrumb>
				</header>
				<div className="flex flex-1 flex-col gap-4 p-4">
					<Outlet />
				</div>
			</SidebarInset>
		</SidebarProvider>
	);
}
