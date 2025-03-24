import { getFullGame } from "~/services/igdb";
import type { Route } from "./+types/game";
import { validateParam } from "~/lib/validate-param";
import { db } from "~/db";
import { games } from "~/db/schema/games";
import { validateAndMapGame } from "~/services/database-sync";
import { eq } from "drizzle-orm";

export const loader = async ({ request, params }: Route.LoaderArgs) => {
  const gameId = validateParam(params.gameId, "/collection/gamges")
	const game = await getFullGame(Number(gameId));

  if (!game) {
    throw new Error("Game not found");
  }
  
  const validGame = validateAndMapGame(game);
  await db.update(games).set(validGame).where(eq(games.id, validGame.id));

  return game;
};

export default function GamePage({ loaderData }: Route.ComponentProps) {
  const game = loaderData;

	return (
    <div>
      <h2>{game.name}</h2>
    </div>
  )
}
