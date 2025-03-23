import { relations } from "drizzle-orm";
import {
	boolean,
	integer,
	pgTable,
	primaryKey,
	text,
	timestamp,
	uuid,
} from "drizzle-orm/pg-core";
import { user } from "./auth";
import { games } from "./games";

export const playlists = pgTable("playlists", {
	id: uuid("id").primaryKey().defaultRandom(),
	name: text("name").notNull(),
	creatorId: text("creator_id")
		.notNull()
		.references(() => user.id),
	createdAt: timestamp("created_at", { mode: "date" }).notNull(),
	updatedAt: timestamp("updated_at", { mode: "date" }).notNull(),
	isPrivate: boolean("is_private").notNull().default(true),
});

export const playlistsRelations = relations(playlists, ({ one, many }) => ({
	creator: one(user, {
		fields: [playlists.creatorId],
		references: [user.id],
	}),
	games: many(gamesToPlaylists),
}));

export const gamesToPlaylists = pgTable(
	"games_to_playlists",
	{
		gameId: integer("game_id")
			.notNull()
			.references(() => games.id),
		playlistId: uuid("playlist_id")
			.notNull()
			.references(() => playlists.id),
	},
	(t) => [primaryKey({ columns: [t.gameId, t.playlistId] })],
);

export const gamesToPlaylistsRelations = relations(gamesToPlaylists, ({ one }) => ({
	game: one(games, {
		fields: [gamesToPlaylists.gameId],
		references: [games.id],
	}),
	playlist: one(playlists, {
		fields: [gamesToPlaylists.playlistId],
		references: [playlists.id],
	}),
}));
