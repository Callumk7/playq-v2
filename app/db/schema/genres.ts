import { relations } from "drizzle-orm";
import {
	boolean,
	integer,
	pgTable,
	primaryKey,
	text,
	timestamp,
} from "drizzle-orm/pg-core";
import { games } from "./games";

export const genres = pgTable("genres", {
	id: integer("id").primaryKey(), // Using the IGDB id as the primary key
	name: text("name").notNull().unique(),
	createdAt: timestamp("created_at").notNull().defaultNow(),
	updatedAt: timestamp("updated_at").notNull().defaultNow(),
	isUpdated: boolean("is_updated").default(false).notNull(),
});

export const genresRelations = relations(genres, ({ many }) => ({
	games: many(genresToGames),
}));

export const genresToGames = pgTable(
	"genres_to_games",
	{
		genreId: integer("genre_id").notNull(),
		gameId: integer("game_id").notNull(),
		createdAt: timestamp("created_at").notNull().defaultNow(),
		updatedAt: timestamp("updated_at").notNull().defaultNow(),
		isUpdated: boolean("is_updated").default(false).notNull(),
	},

	(t) => [
		{
			pk: primaryKey({ columns: [t.genreId, t.gameId] }),
		},
	],
);

export const genresToGamesRelations = relations(genresToGames, ({ one }) => ({
	genre: one(genres, {
		fields: [genresToGames.genreId],
		references: [genres.id],
	}),
	game: one(games, {
		fields: [genresToGames.gameId],
		references: [games.id],
	}),
}));
