import { MainLayout } from "~/components/layout/main";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import type { Route } from "./+types/steam";
import { parseQuery } from "zodix";
import { z } from "zod";
import { Form, useFetcher } from "react-router";
import { Button } from "~/components/ui/button";
import { useAuth } from "~/components/context/auth";

// SO, we need to...
// 1. get steam id from user, provide instructions for how to do this
// 2. get game data, save to collection - this should happen outside the loader lifecycle

export const loader = async ({ request }: Route.ActionArgs) => {
	const { steamId } = parseQuery(request, {
		steamId: z.string(),
	});

	try {
		const library = await getSteamLibrary(steamId);
		return library;
	} catch (error) {
		console.error(error);
		return null;
	}
};

export default function SteamSyncPage({ loaderData }: Route.ComponentProps) {
	const saveGamesFetcher = useFetcher();
	const { user } = useAuth();

	const handleSaveGames = () => {
		if (loaderData?.response) {
			const steamIds = loaderData?.response.games.map(
				(game: { appid: number }) => game.appid,
			);
			if (steamIds) {
				saveGamesFetcher.submit(
					{ steamIds },
					{
						action: `/api/collection/${user.id}`,
						method: "post",
						encType: "application/json",
					},
				);
			}
		}
	};

	return (
		<MainLayout>
			<Form method="get">
				<div className="grid w-full max-w-sm items-center gap-3">
					<Label htmlFor="steamId">Steam ID</Label>
					<Input name="steamId" />
				</div>
				<Button type="submit">Send</Button>
			</Form>

			<div>
				{loaderData
					? loaderData.response.games.map((game) => (
							<p key={game.name}>
								{game.name}, played for {game.playtime_forever}
							</p>
						))
					: null}
				<Button onClick={handleSaveGames}>Save Games</Button>
			</div>
		</MainLayout>
	);
}

async function getSteamLibrary(steamId: string) {
	const response = await fetch(
		`http://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?key=9685331AE8EEB302BF113B4D2B2EBA62&steamid=${steamId}&format=json&include_appinfo=true`,
	);

	if (!response.ok) {
		throw new Error("Unable to fetch library from steam, please check ID");
	}

	const json = await response.json();
	const library = z
		.object({
			response: z.object({
				games: z.array(
					z.object({
						appid: z.number(),
						name: z.string(),
						playtime_forever: z.number(),
					}),
				),
			}),
		})
		.safeParse(json);

	if (library.error) {
		throw library.error;
	}

	return library.data;
}
