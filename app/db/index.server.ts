import { drizzle } from "drizzle-orm/postgres-js";
import * as authSchema from "./schema/auth";
import * as gamesSchema from "./schema/games";
import * as collectionSchema from "./schema/collection";
import * as playlistsSchema from "./schema/playlists";
import { env } from "~/lib/env";

export const db = drizzle(env.DATABASE_URL, {
	schema: { ...authSchema, ...gamesSchema, ...collectionSchema, ...playlistsSchema },
});
