import { integer, pgTable, primaryKey, text } from "drizzle-orm/pg-core";
import { user } from "./auth";
import { games } from "./games";
import { relations } from "drizzle-orm";

export const usersToGames = pgTable(
	"users_to_games",
	{
		userId: text("user_id")
			.notNull()
			.references(() => user.id, { onDelete: "cascade" }),
		gameId: integer("game_id")
			.notNull()
			.references(() => games.id, { onDelete: "cascade" }),
	},
	(t) => [
		primaryKey({ columns: [t.userId, t.gameId] }),
	],
);

export const usersToGamesRelations = relations(usersToGames, ({ one, many }) => ({
	user: one(user, {
		fields: [usersToGames.userId],
		references: [user.id],
	}),
	game: one(games, {
		fields: [usersToGames.gameId],
		references: [games.id],
	}),
}));
