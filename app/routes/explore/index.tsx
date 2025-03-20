import { getTopRatedRecentGames } from "~/services/igdb";
import type { Route } from "./+types/index";

export const loader = async ({
  request,
  params,
  context,
}: Route.LoaderArgs) => {
  const games = await getTopRatedRecentGames();

  return games;
};

export default function ExploreIndexPage({ loaderData }: Route.ComponentProps) {
  const games = loaderData;
  return (
    <div>
      {games.map((game) => (
        <div key={game.id}>
          <p>{game.name}</p>
        </div>
      ))}
    </div>
  );
}
