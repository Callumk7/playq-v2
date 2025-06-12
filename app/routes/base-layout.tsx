import {
	Link,
	Outlet,
	useMatches,
	type LoaderFunctionArgs,
	type UIMatch,
} from "react-router";
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbSeparator,
} from "~/components/ui/breadcrumb";
import { Separator } from "~/components/ui/separator";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "~/components/ui/sidebar";
import { getPlaylists } from "~/db/queries/playlist";
import { getAndValidateSession } from "~/lib/auth/helpers";
import type { Route } from "./+types/base-layout";
import { AppSidebar } from "~/components/sidebar/app-sidebar";
import { env } from "~/lib/env";
import { LocalCache } from "~/lib/cache";
import { Fragment, useCallback, useEffect, useMemo } from "react";

export const loader = async ({ request }: LoaderFunctionArgs) => {
	const session = await getAndValidateSession(request);
	const userPlaylists = await getPlaylists(session.user.id);

	// Return the API key to the client
	const key = env.API_GATEWAY_KEY;

	return { key, userPlaylists };
};

// TODO: proper log out

export default function BaseLayout({ loaderData }: Route.ComponentProps) {
	const { userPlaylists, key } = loaderData;

	// Memoize the cache instance
	const cache = useMemo(() => new LocalCache(), []);

	// Memoize the set operation
	const setCache = useCallback(
		(key: string, value: string) => {
			cache.set(key, value);
		},
		[cache],
	);

	useEffect(() => {
		setCache("key", key);
	}, [key, setCache]);

	const matches = useMatches() as UIMatch<unknown, { breadcrumb: string } | undefined>[];
	return (
		<SidebarProvider>
			<title>playQ: Social Playlists</title>
			<AppSidebar playlists={userPlaylists} />
			<SidebarInset>
				<header className="flex sticky top-0 bg-background h-16 shrink-0 items-center gap-2 border-b px-4 z-50">
					<SidebarTrigger className="-ml-1" />
					<Separator orientation="vertical" className="mr-2 h-4" />
					<Breadcrumb>
						<BreadcrumbList>
							{matches.map((match, i) => {
								if (match.pathname === "/") return null;

								// Only render if there's a breadcrumb
								if (!match.handle?.breadcrumb) return null;

								// Use a unique key for each match - pathname is usually unique
								return (
									<Fragment key={match.pathname}>
										<BreadcrumbItem className="hidden md:block">
											<BreadcrumbLink asChild>
												<Link to={match.pathname}>{match.handle.breadcrumb}</Link>
											</BreadcrumbLink>
										</BreadcrumbItem>
										{i !== matches.length - 1 && (
											<BreadcrumbSeparator className="hidden md:block" />
										)}
									</Fragment>
								);
							})}
						</BreadcrumbList>
					</Breadcrumb>
				</header>
				<div className="flex flex-1 flex-col gap-4">
					<Outlet />
				</div>
			</SidebarInset>
		</SidebarProvider>
	);
}
