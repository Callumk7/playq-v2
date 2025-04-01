import { relations } from "drizzle-orm";
import {
	integer,
	pgEnum,
	pgTable,
	primaryKey,
	text,
	timestamp,
	uuid,
} from "drizzle-orm/pg-core";
import { user } from "./auth";
import { games } from "./games";
import { createInsertSchema } from "drizzle-zod";
import type { z } from "zod";

export const privacySettingEnum = pgEnum("privacy_setting", ["PUBLIC", "FRIENDS_ONLY", "LINK_SHARING", "PRIVATE"]);

export const playlists = pgTable("playlists", {
	id: uuid("id").primaryKey().defaultRandom(),
	name: text("name").notNull(),
	creatorId: text("creator_id")
		.notNull()
		.references(() => user.id),
	createdAt: timestamp("created_at", { mode: "date" }).notNull(),
	updatedAt: timestamp("updated_at", { mode: "date" }).notNull(),
	privacySetting: privacySettingEnum().default("PRIVATE")
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

export const playlistsInsertSchema = createInsertSchema(playlists);
export type PlaylistsInsertSchemaType = z.infer<typeof playlistsInsertSchema>;

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

export const roleEnum = pgEnum("role", ["OWNER", "EDITOR", "COLLABORATOR", "VIEWER"]);

export const playlistPermissions = pgTable("playlist_permissions", {
	permissionId: uuid("permission_id").defaultRandom(),
	playlistId: uuid("playlist_id").references(() => playlists.id),
	userId: text("user_id").references(() => user.id),
	createdAt: timestamp("created_at", { mode: "date" }).notNull(),
	updatedAt: timestamp("updated_at", { mode: "date" }).notNull(),
	grantedAt: timestamp("granted_at", { mode: "date" }).notNull(),
	grantedBy: text("granted_by").notNull(),
	roleType: roleEnum()
})

export const playlistPermissionsRelations = relations(playlistPermissions, ({one}) => ({
	playlist: one(playlists, {
		fields: [playlistPermissions.playlistId],
		references: [playlists.id],
	}),
	user: one(user, {
		fields: [playlistPermissions.userId],
		references: [user.id],
	})
}))

