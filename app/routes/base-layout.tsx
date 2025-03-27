import { Link, Outlet, useMatches, type LoaderFunctionArgs, type UIMatch } from "react-router";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList, BreadcrumbSeparator
} from "~/components/ui/breadcrumb";
import { Separator } from "~/components/ui/separator";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "~/components/ui/sidebar";
import { getPlaylists } from "~/db/queries/playlist";
import { getAndValidateSession } from "~/lib/auth/helpers";
import type { Route } from "./+types/base-layout";
import { AppSidebar } from "~/components/sidebar/app-sidebar";

export const loader = async ({ request }: LoaderFunctionArgs) => {
	const session = await getAndValidateSession(request);
	const userPlaylists = await getPlaylists(session.user.id);
	return userPlaylists;
};

// TODO: Implement breadcrumbs
// TODO: proper log out

export default function BaseLayout({ loaderData }: Route.ComponentProps) {
	const userPlaylists = loaderData;

	const matches = useMatches() as UIMatch<unknown, { breadcrumb: string } | undefined>[];
	console.log(matches);
	return (
		<SidebarProvider>
			<AppSidebar playlists={userPlaylists} />
			<SidebarInset>
				<header className="flex sticky top-0 bg-background h-16 shrink-0 items-center gap-2 border-b px-4">
					<SidebarTrigger className="-ml-1" />
					<Separator orientation="vertical" className="mr-2 h-4" />
					<Breadcrumb>
						<BreadcrumbList>
							{matches.map((match, i) => {
								if (match.pathname === "/") return null;
								return (
                  <>
                    {match.handle?.breadcrumb ? (
                      <>
                        <BreadcrumbItem key={match.pathname} className="hidden md:block">
                          <BreadcrumbLink asChild>
                            <Link to={match.pathname}>
                              {match.handle.breadcrumb}
                            </Link>
                          </BreadcrumbLink>
                        </BreadcrumbItem>
                        {i !== matches.length - 1 && (
                          <BreadcrumbSeparator className="hidden md:block" />
                        )}
                      </>
                    ) : null}
                  </>
								);
							})}
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
